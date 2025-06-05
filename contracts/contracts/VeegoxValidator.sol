
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./VeegoxConsensus.sol";

contract VeegoxValidator is ReentrancyGuard {
    VeegoxConsensus public consensus;
    IERC20 public stakingToken;
    uint256 public stakingRequirement;
    
    mapping(address => uint256) public stakedAmounts;
    mapping(address => bool) public activeValidators;
    
    event ValidatorJoined(address indexed validator, uint256 amount);
    event ValidatorLeft(address indexed validator, uint256 amount);
    event StakeIncreased(address indexed validator, uint256 amount);
    
    constructor(address _consensus, uint256 _stakingRequirement) {
        consensus = VeegoxConsensus(_consensus);
        stakingRequirement = _stakingRequirement;
    }
    
    function setStakingToken(address _token) external {
        require(msg.sender == address(consensus), "Only consensus");
        stakingToken = IERC20(_token);
    }
    
    function becomeValidator(uint256 _amount) external nonReentrant {
        require(_amount >= stakingRequirement, "Insufficient stake amount");
        require(!activeValidators[msg.sender], "Already active validator");
        require(address(stakingToken) != address(0), "Staking token not set");
        
        // Transfer tokens from user
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        stakedAmounts[msg.sender] = _amount;
        activeValidators[msg.sender] = true;
        
        // Add to consensus
        consensus.addValidator(msg.sender, _amount);
        
        emit ValidatorJoined(msg.sender, _amount);
    }
    
    function leaveValidator() external nonReentrant {
        require(activeValidators[msg.sender], "Not an active validator");
        
        uint256 stakedAmount = stakedAmounts[msg.sender];
        stakedAmounts[msg.sender] = 0;
        activeValidators[msg.sender] = false;
        
        // Remove from consensus
        consensus.removeValidator(msg.sender);
        
        // Return staked tokens
        require(stakingToken.transfer(msg.sender, stakedAmount), "Transfer failed");
        
        emit ValidatorLeft(msg.sender, stakedAmount);
    }
    
    function increaseStake(uint256 _amount) external nonReentrant {
        require(activeValidators[msg.sender], "Not an active validator");
        require(_amount > 0, "Amount must be positive");
        
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        stakedAmounts[msg.sender] += _amount;
        
        emit StakeIncreased(msg.sender, _amount);
    }
    
    function getStakedAmount(address _validator) external view returns (uint256) {
        return stakedAmounts[_validator];
    }
    
    function isActiveValidator(address _validator) external view returns (bool) {
        return activeValidators[_validator];
    }
}
