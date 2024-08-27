// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
interface IESStaking {
    function stake(address sender, address tokenAddress, uint amount) external;
    function unstake(address sender, address tokenAddress, uint id) external;
    function claimRewards(address sender, address tokenAddress, uint id) external;
    function getBalance(address sender, address tokenAddress, uint id) external view returns (uint, uint);
}