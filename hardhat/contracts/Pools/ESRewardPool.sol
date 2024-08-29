// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;

import "../Interfaces/IESRewardPool.sol";
import "../utils/Enums.sol";
import "../utils/Structs.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ESRewardPoolV1 is IESRewardPool, Ownable {

    mapping(address => uint) currentFees;
    mapping(address => RewardData) amountsTransferred;
    mapping(LockPeriod => uint) timeUnits;
    uint constant defaultFee = 1000;

    constructor() Ownable(msg.sender) {
        timeUnits[LockPeriod.Day] = 1 days;
        timeUnits[LockPeriod.Week] = 1 weeks;
        timeUnits[LockPeriod.TwoWeeks] = 2 weeks;
        timeUnits[LockPeriod.Month] = 30 days;
        timeUnits[LockPeriod.TwoMonth] = 60 days;
        timeUnits[LockPeriod.ThreeMonth] = 90 days;
        timeUnits[LockPeriod.SixMonth] = 180 days;
        timeUnits[LockPeriod.Year] = 365 days;
    }


    function addRewardToPool(RewardData memory rewardData) external {
        require(IERC20(rewardData.tokenAddress).balanceOf(msg.sender) >= rewardData.amount);
        //require(IERC20(tokenAddress).allowance(msg.sender, address(this)) >= rewardData.amount);
        IERC20(rewardData.tokenAddress).transferFrom(msg.sender, address(this), rewardData.amount);
        currentFees[rewardData.tokenAddress] = defaultFee;

        rewardData.unlocksAt = 0;
        if(rewardData.hasLockPeriod) {
            rewardData.unlocksAt = timeUnits[rewardData.lockPeriod];
        }
        amountsTransferred[rewardData.tokenAddress] = rewardData;
    }
    function transferRewardToUser(address tokenAddress, address to, uint amount) external {
        require(IERC20(tokenAddress).balanceOf(address(this)) >= amount);
        IERC20(tokenAddress).transfer(to, amount);
    }
    function getRewardPerCycle(address tokenAddress) external view returns(uint256) {
        uint airdropPerDay = amountsTransferred[tokenAddress].amount; // (div numberOfDaysLocked)
        if(amountsTransferred[tokenAddress].hasLockPeriod) {
            airdropPerDay /= amountsTransferred[tokenAddress].unlocksAt;
        }
        // uint balance = IERC20(tokenAddress).balanceOf(address(this));
        return airdropPerDay;
    }

    function setRewardFee(address tokenAddress, uint fee) external onlyOwner {
        currentFees[tokenAddress] = fee;
    }

    receive() external payable {}
}