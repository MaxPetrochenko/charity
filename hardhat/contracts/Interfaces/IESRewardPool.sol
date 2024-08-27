// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
interface IESRewardPool {
    function addRewardToPool(address tokenAddress, uint amount) external;
    function transferRewardToUser(address tokenAddress, address to, uint amount) external;
    function getRewardFee(address tokenAddress) external view returns(uint256);
}