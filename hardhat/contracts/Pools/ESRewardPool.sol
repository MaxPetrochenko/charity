// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;

import "../Interfaces/IESRewardPool.sol";
import "../utils/Enums.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ESRewardPoolV1 is IESRewardPool, Ownable {

    mapping(address => uint) currentFees;
    mapping(address => uint) amountsTransferred;
    uint constant defaultFee = 1000;

    constructor() Ownable(msg.sender) {
        
    }


    function addRewardToPool(address tokenAddress, uint amount, bool hasLockPeriod, LockPeriod lockPeriod) external {
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= amount);
        require(IERC20(tokenAddress).allowance(msg.sender, address(this)) >= amount);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        currentFees[tokenAddress] = defaultFee;
        amountsTransferred[tokenAddress] = amount;
        if(hasLockPeriod) {

        }
        else
    }
    function transferRewardToUser(address tokenAddress, address to, uint amount) external {
        require(IERC20(tokenAddress).balanceOf(address(this)) >= amount);
        IERC20(tokenAddress).transfer(to, amount);
    }
    function getRewardFee(address tokenAddress) external view returns(uint256) {
        uint airdropPerDay = amountsTransferred[tokenAddress] / currentFees[tokenAddress]; // (div numberOfDaysLocked)
        uint balance = IERC20(tokenAddress).balanceOf(address(this));
        // now we don't lock tokens
        // TODO: implement locking with unlockesAt...

        return currentFees[tokenAddress];
    }

    function setRewardFee(address tokenAddress, uint fee) external onlyOwner {
        currentFees[tokenAddress] = fee;
    }
}