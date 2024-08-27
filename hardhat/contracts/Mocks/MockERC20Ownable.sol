// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockERC20Ownable is ERC20, Ownable {

    constructor(string memory _name, string memory _symbol) 
        ERC20(_name, _symbol) 
        Ownable(msg.sender) {
    }

    using Math for uint256;

    function mint(address to, uint amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(address from, uint amount) external onlyOwner {
        _burn(from, amount);
    }

}