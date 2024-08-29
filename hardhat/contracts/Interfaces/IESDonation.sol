// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;

import "../utils/Enums.sol";
import "../utils/Structs.sol";

interface IESDonation {
    function donate(address tokenAddress, uint amount) external payable;
}