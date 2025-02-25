// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingNFT is ERC721URIStorage, Ownable {
    string constant imageURI = "https://scontent-fra3-2.cdninstagram.com/v/t51.2885-19/279294675_1714831195532524_3398088994308604790_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-fra3-2.cdninstagram.com&_nc_cat=104&_nc_ohc=L9LDoBNUEyAQ7kNvgEYq1j5&edm=AEhyXUkBAAAA&ccb=7-5&oh=00_AYCAekJpglPepBhNfgr3N7ngp_wVivkgnKWxynCGDDLJeA&oe=6692EC58&_nc_sid=8f1549";

    constructor() ERC721("ESNFT", "ESNFT") Ownable(msg.sender) {}
    
    using Math for uint256;

    uint public tokenCounter;

    function createNFT(address to) public onlyOwner returns (uint) {
        _safeMint(to, tokenCounter);
        _setTokenURI(tokenCounter, imageURI);
        tokenCounter++;
        return tokenCounter;
    }

}