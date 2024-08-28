// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "../utils/Enums.sol";

interface IESRewardPool {
    function addRewardToPool(address tokenAddress, uint amount, bool hasLockPeriod, LockPeriod lockPeriod) external;
    function transferRewardToUser(address tokenAddress, address to, uint amount) external;
    function getRewardFee(address tokenAddress) external view returns(uint256);
}