
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VeegoxConsensus is Ownable, ReentrancyGuard {
    uint256 public stakingRequirement;
    uint256 public blockTime;
    address public stakingToken;
    
    mapping(address => bool) public validators;
    mapping(address => uint256) public stakes;
    address[] public validatorList;
    
    event ValidatorAdded(address indexed validator, uint256 stake);
    event ValidatorRemoved(address indexed validator);
    event StakingTokenSet(address indexed token);
    
    constructor(uint256 _stakingRequirement, uint256 _blockTime) {
        stakingRequirement = _stakingRequirement;
        blockTime = _blockTime;
    }
    
    function setStakingToken(address _token) external onlyOwner {
        stakingToken = _token;
        emit StakingTokenSet(_token);
    }
    
    function addValidator(address _validator, uint256 _stake) external onlyOwner {
        require(_stake >= stakingRequirement, "Insufficient stake");
        require(!validators[_validator], "Already a validator");
        
        validators[_validator] = true;
        stakes[_validator] = _stake;
        validatorList.push(_validator);
        
        emit ValidatorAdded(_validator, _stake);
    }
    
    function removeValidator(address _validator) external onlyOwner {
        require(validators[_validator], "Not a validator");
        
        validators[_validator] = false;
        stakes[_validator] = 0;
        
        // Remove from list
        for (uint i = 0; i < validatorList.length; i++) {
            if (validatorList[i] == _validator) {
                validatorList[i] = validatorList[validatorList.length - 1];
                validatorList.pop();
                break;
            }
        }
        
        emit ValidatorRemoved(_validator);
    }
    
    function getValidators() external view returns (address[] memory) {
        return validatorList;
    }
    
    function getValidatorCount() external view returns (uint256) {
        return validatorList.length;
    }
    
    function isValidator(address _validator) external view returns (bool) {
        return validators[_validator];
    }
}
