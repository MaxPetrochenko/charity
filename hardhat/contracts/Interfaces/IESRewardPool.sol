// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "../utils/Enums.sol";
import "../utils/Structs.sol";

interface IESRewardPool {
    function addRewardToPool(RewardData memory rewardData) external;
    function transferRewardToUser(address tokenAddress, address to, uint amount) external;
    function getRewardPerCycle(address tokenAddress) external view returns(uint256);
}