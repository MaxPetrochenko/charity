// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Interfaces/IESStaking.sol";
import "./Interfaces/IESRewardPool.sol";
import "./ESStakingNFT.sol";
import "./utils/Structs.sol";

contract ESStaking is IESStaking, Ownable, ReentrancyGuard {
    using Math for uint;
    using Address for address;
    using Arrays for StakeBalance[];
    using Arrays for uint[];

    string constant MINT_NFT = "createNFT(address)";
    uint constant rewardsIn = 1 minutes;

    ESStakingNFT nft;
    
    mapping(address => mapping(address => StakeBalance[])) balances; //user->token->values
    mapping(address => uint[]) nftCollection; // nft collection

    constructor() Ownable(msg.sender) {
        nft = new ESStakingNFT();
    }

    function stake(address sender, address tokenAddress, uint amount) nonReentrant external {
        require(IERC20(tokenAddress).balanceOf(sender) >= amount, 'Insufficient amount');
        IERC20(tokenAddress).transferFrom(sender, address(this), amount);
        uint id = balances[sender][tokenAddress].length;
        StakeBalance memory stakeBalance = StakeBalance(id, amount, block.timestamp, 0, 0);
        balances[sender][tokenAddress].push(stakeBalance);
        // mint nft
        if(nftCollection[sender].length == 0) {
            nftCollection[sender].push(nft.createNFT(sender));
        }
    }

    function unstake(address sender, address tokenAddress, uint id) nonReentrant external { //not payable, staking tokens only
        require(balances[sender][tokenAddress].length > id, 'no token with this id staked by this sender');
        (uint balance, uint reward) = getBalance(sender, tokenAddress, id);
        IESRewardPool(tokenAddress).transferRewardToUser(sender, reward);
        IERC20(tokenAddress).transfer(sender, balance);
        balances[sender][tokenAddress][id].value -= balance;
        uint _now = block.timestamp;
        balances[sender][tokenAddress][id].lastRewardedAt = _now;
        balances[sender][tokenAddress][id].unstakedAt = _now;
    }

    function claimRewards(address sender, address tokenAddress, uint id) nonReentrant external { //not payable, staking tokens only
        require(balances[sender][tokenAddress].length > id, 'no token with this id staked by this sender');
        (, uint reward) = getBalance(sender, tokenAddress, id);
        IESRewardPool(tokenAddress).transferRewardToUser(sender, reward);
        balances[sender][tokenAddress][id].lastRewardedAt = block.timestamp;
    }

    function getBalance(address sender, address tokenAddress, uint id) public view returns (uint, uint) {
        require(balances[sender][tokenAddress].length > id, 'no token with this id staked by this sender');
        uint balance = balances[sender][tokenAddress][id].value;
        uint lastRewardedAt = Math.max(balances[sender][tokenAddress][id].stakedAt, balances[sender][tokenAddress][id].lastRewardedAt);
        uint numberOfCycles = ((block.timestamp - lastRewardedAt) / rewardsIn);
        uint reward = numberOfCycles * IESRewardPool(tokenAddress).getRewardFee() * balance;
        return (balance, reward);
    }

    receive() external payable {}
}
