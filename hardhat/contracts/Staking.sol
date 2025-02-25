// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Interfaces/IStaking.sol";
import "./Interfaces/IRewardPool.sol";
import "./StakingNFT.sol";
import "./utils/Structs.sol";

contract Staking is IStaking, Ownable, ReentrancyGuard {
    using Math for uint;
    using Address for address;
    using Arrays for StakeBalance[];
    using Arrays for uint[];

    string constant MINT_NFT = "createNFT(address)";
    uint constant rewardsIn = 1 minutes;

    StakingNFT nft;
    IRewardPool pool;


    mapping(address => mapping(address => StakeBalance[])) balances; //user->token->values
    mapping(address => uint[]) nftCollection; // nft collection
    //mapping()

    constructor(address _pool) Ownable(msg.sender) {
        pool = IESRewardPool(_pool);
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
        pool.transferRewardToUser(tokenAddress, sender, reward);
        IERC20(tokenAddress).transfer(sender, balance);
        balances[sender][tokenAddress][id].value -= balance;
        uint _now = block.timestamp;
        balances[sender][tokenAddress][id].lastRewardedAt = _now;
        balances[sender][tokenAddress][id].unstakedAt = _now;
    }

    function claimRewards(address sender, address tokenAddress, uint id) nonReentrant external { //not payable, staking tokens only
        require(balances[sender][tokenAddress].length > id, 'no token with this id staked by this sender');
        (, uint reward) = getBalance(sender, tokenAddress, id);
        pool.transferRewardToUser(tokenAddress, sender, reward);
        balances[sender][tokenAddress][id].lastRewardedAt = block.timestamp;
    }

    function getBalance(address sender, address tokenAddress, uint id) public view returns (uint, uint) {
        require(balances[sender][tokenAddress].length > id, 'no token with this id staked by this sender');
        uint balance = balances[sender][tokenAddress][id].value;
        uint lastRewardedAt = Math.max(balances[sender][tokenAddress][id].stakedAt, balances[sender][tokenAddress][id].lastRewardedAt);
        uint numberOfCycles = ((block.timestamp - lastRewardedAt) / rewardsIn);
        uint userPercent = 100 * balance / IERC20(tokenAddress).balanceOf(address(this));
        uint reward = userPercent * numberOfCycles * pool.getRewardPerCycle(tokenAddress);
        return (balance, reward);
    }

    receive() external payable {}
}
