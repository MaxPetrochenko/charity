// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Interfaces/IESRewardPool.sol";

contract ESToken is ERC20, Ownable, IESRewardPool {

    constructor() 
        ERC20("ESToken", "ESToken") 
        Ownable(msg.sender) {
    }

    using Math for uint256;

    function mint(address to, uint amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(address from, uint amount) external onlyOwner {
        _burn(from, amount);
    }

    function addRewardToPool(address pool, uint amount) external onlyOwner {
        approve(pool, amount);
        transfer(pool, amount);
    }

    function transferRewardToUser(address to, uint amount) external {

    }

    function getRewardFee() external view returns(uint256) {

    }

}