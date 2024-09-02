// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "./Enums.sol";

struct StakeBalance {
    uint id;
    uint value;
    uint stakedAt;
    uint lastRewardedAt;
    uint unstakedAt;
}
struct RewardData {
    address tokenAddress;
    bool hasLockPeriod;
    uint amount;
    uint unlocksAt;
    LockPeriod lockPeriod;
}


