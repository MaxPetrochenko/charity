// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
interface IESRewardPool {
    function addRewardToPool(uint amount) external;
    function transferRewardToUser(address to, uint amount) external;
    function getRewardFee() external view returns(uint256);
}