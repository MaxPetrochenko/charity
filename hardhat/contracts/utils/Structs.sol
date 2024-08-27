// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
struct StakeBalance {
    uint id;
    uint value;
    uint stakedAt;
    uint lastRewardedAt;
    uint unstakedAt;
}