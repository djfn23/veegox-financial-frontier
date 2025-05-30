
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VeegoxEcosystem is ERC20, Ownable, Pausable, ReentrancyGuard {
    // Token types
    enum TokenType { VEX, sVEX, gVEX }
    
    // Token balances for each type
    mapping(address => mapping(TokenType => uint256)) private _balances;
    mapping(TokenType => uint256) private _totalSupply;
    
    // Token configurations
    uint256 public constant MAX_SUPPLY_VEX = 100_000_000 * 10**18;  // 100M VEX
    uint256 public constant MAX_SUPPLY_SVEX = 50_000_000 * 10**18;  // 50M sVEX
    uint256 public constant MAX_SUPPLY_GVEX = 25_000_000 * 10**18;  // 25M gVEX
    
    // Staking configuration
    mapping(address => StakeInfo) public stakes;
    uint256 public stakingAPY = 850; // 8.5% APY
    uint256 public constant STAKING_DURATION = 90 days;
    
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardTime;
        uint256 rewards;
    }
    
    // Governance configuration
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;
    uint256 public constant QUORUM_THRESHOLD = 10_000 * 10**18; // 10,000 gVEX
    uint256 public constant VOTING_DURATION = 7 days;
    
    struct Proposal {
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        bool active;
        address proposer;
    }
    
    // Swap configuration
    uint256 public swapFeeRate = 30; // 0.3%
    mapping(TokenType => uint256) public reserveBalances;
    
    // Events
    event TokenMinted(address indexed to, TokenType tokenType, uint256 amount);
    event TokenBurned(address indexed from, TokenType tokenType, uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 rewards);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 votingPower);
    event ProposalExecuted(uint256 indexed proposalId);
    event TokenSwapped(address indexed user, TokenType fromToken, TokenType toToken, uint256 fromAmount, uint256 toAmount);
    
    constructor() ERC20("Veegox Ecosystem", "VGX") {
        // Initialize with some initial supply
        _mint(msg.sender, 1_000_000 * 10**18); // 1M VEX for initial liquidity
        _setBalance(msg.sender, TokenType.VEX, 1_000_000 * 10**18);
        _totalSupply[TokenType.VEX] = 1_000_000 * 10**18;
    }
    
    // Token balance functions
    function balanceOf(address account, TokenType tokenType) public view returns (uint256) {
        return _balances[account][tokenType];
    }
    
    function totalSupply(TokenType tokenType) public view returns (uint256) {
        return _totalSupply[tokenType];
    }
    
    function _setBalance(address account, TokenType tokenType, uint256 amount) internal {
        _balances[account][tokenType] = amount;
    }
    
    // Minting functions
    function mintVEX(address to, uint256 amount) external onlyOwner {
        require(_totalSupply[TokenType.VEX] + amount <= MAX_SUPPLY_VEX, "Exceeds VEX max supply");
        _setBalance(to, TokenType.VEX, _balances[to][TokenType.VEX] + amount);
        _totalSupply[TokenType.VEX] += amount;
        emit TokenMinted(to, TokenType.VEX, amount);
    }
    
    function mintSVEX(address to, uint256 amount) external onlyOwner {
        require(_totalSupply[TokenType.sVEX] + amount <= MAX_SUPPLY_SVEX, "Exceeds sVEX max supply");
        _setBalance(to, TokenType.sVEX, _balances[to][TokenType.sVEX] + amount);
        _totalSupply[TokenType.sVEX] += amount;
        emit TokenMinted(to, TokenType.sVEX, amount);
    }
    
    function mintGVEX(address to, uint256 amount) external onlyOwner {
        require(_totalSupply[TokenType.gVEX] + amount <= MAX_SUPPLY_GVEX, "Exceeds gVEX max supply");
        _setBalance(to, TokenType.gVEX, _balances[to][TokenType.gVEX] + amount);
        _totalSupply[TokenType.gVEX] += amount;
        emit TokenMinted(to, TokenType.gVEX, amount);
    }
    
    // Staking functions
    function stakeVEX(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(_balances[msg.sender][TokenType.VEX] >= amount, "Insufficient VEX balance");
        
        // If user already has a stake, claim rewards first
        if (stakes[msg.sender].amount > 0) {
            claimRewards();
        }
        
        // Transfer VEX to contract
        _setBalance(msg.sender, TokenType.VEX, _balances[msg.sender][TokenType.VEX] - amount);
        
        // Update stake info
        stakes[msg.sender] = StakeInfo({
            amount: stakes[msg.sender].amount + amount,
            startTime: block.timestamp,
            lastRewardTime: block.timestamp,
            rewards: 0
        });
        
        emit Staked(msg.sender, amount);
    }
    
    function unstakeVEX() external nonReentrant {
        StakeInfo storage stake = stakes[msg.sender];
        require(stake.amount > 0, "No active stake");
        require(block.timestamp >= stake.startTime + STAKING_DURATION, "Staking period not complete");
        
        uint256 stakedAmount = stake.amount;
        uint256 rewards = calculateRewards(msg.sender);
        
        // Reset stake
        stakes[msg.sender] = StakeInfo(0, 0, 0, 0);
        
        // Return VEX and mint sVEX rewards
        _setBalance(msg.sender, TokenType.VEX, _balances[msg.sender][TokenType.VEX] + stakedAmount);
        if (rewards > 0) {
            _setBalance(msg.sender, TokenType.sVEX, _balances[msg.sender][TokenType.sVEX] + rewards);
            _totalSupply[TokenType.sVEX] += rewards;
        }
        
        emit Unstaked(msg.sender, stakedAmount, rewards);
    }
    
    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            stakes[msg.sender].rewards = 0;
            stakes[msg.sender].lastRewardTime = block.timestamp;
            
            _setBalance(msg.sender, TokenType.sVEX, _balances[msg.sender][TokenType.sVEX] + rewards);
            _totalSupply[TokenType.sVEX] += rewards;
            
            emit RewardsClaimed(msg.sender, rewards);
        }
    }
    
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo storage stake = stakes[user];
        if (stake.amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - stake.lastRewardTime;
        uint256 rewards = (stake.amount * stakingAPY * timeStaked) / (365 days * 10000);
        
        return rewards + stake.rewards;
    }
    
    // Governance functions
    function createProposal(string memory title, string memory description) external {
        require(_balances[msg.sender][TokenType.gVEX] >= 1000 * 10**18, "Need 1000 gVEX to create proposal");
        
        uint256 proposalId = proposalCount++;
        proposals[proposalId] = Proposal({
            title: title,
            description: description,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_DURATION,
            votesFor: 0,
            votesAgainst: 0,
            executed: false,
            active: true,
            proposer: msg.sender
        });
        
        emit ProposalCreated(proposalId, msg.sender, title);
    }
    
    function vote(uint256 proposalId, bool support) external {
        require(proposalId < proposalCount, "Proposal does not exist");
        require(proposals[proposalId].active, "Proposal is not active");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        uint256 votingPower = _balances[msg.sender][TokenType.gVEX];
        require(votingPower > 0, "No gVEX to vote with");
        
        hasVoted[proposalId][msg.sender] = true;
        
        if (support) {
            proposals[proposalId].votesFor += votingPower;
        } else {
            proposals[proposalId].votesAgainst += votingPower;
        }
        
        emit Voted(proposalId, msg.sender, support, votingPower);
    }
    
    function executeProposal(uint256 proposalId) external {
        require(proposalId < proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[proposalId];
        require(proposal.active, "Proposal is not active");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        require(totalVotes >= QUORUM_THRESHOLD, "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        
        proposal.executed = true;
        proposal.active = false;
        
        emit ProposalExecuted(proposalId);
    }
    
    // Swap functions
    function swapVEXToSVEX(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(_balances[msg.sender][TokenType.VEX] >= amount, "Insufficient VEX balance");
        
        uint256 fee = (amount * swapFeeRate) / 10000;
        uint256 swapAmount = amount - fee;
        
        _setBalance(msg.sender, TokenType.VEX, _balances[msg.sender][TokenType.VEX] - amount);
        _setBalance(msg.sender, TokenType.sVEX, _balances[msg.sender][TokenType.sVEX] + swapAmount);
        
        // Add fee to reserves
        reserveBalances[TokenType.VEX] += fee;
        
        emit TokenSwapped(msg.sender, TokenType.VEX, TokenType.sVEX, amount, swapAmount);
    }
    
    function swapSVEXToVEX(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(_balances[msg.sender][TokenType.sVEX] >= amount, "Insufficient sVEX balance");
        
        uint256 fee = (amount * swapFeeRate) / 10000;
        uint256 swapAmount = amount - fee;
        
        _setBalance(msg.sender, TokenType.sVEX, _balances[msg.sender][TokenType.sVEX] - amount);
        _setBalance(msg.sender, TokenType.VEX, _balances[msg.sender][TokenType.VEX] + swapAmount);
        
        // Add fee to reserves
        reserveBalances[TokenType.sVEX] += fee;
        
        emit TokenSwapped(msg.sender, TokenType.sVEX, TokenType.VEX, amount, swapAmount);
    }
    
    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function setStakingAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 2000, "APY cannot exceed 20%");
        stakingAPY = newAPY;
    }
    
    function setSwapFeeRate(uint256 newFeeRate) external onlyOwner {
        require(newFeeRate <= 100, "Fee rate cannot exceed 1%");
        swapFeeRate = newFeeRate;
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
