// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Interfaces/IStaking.sol";
import "./Interfaces/IDonation.sol";
import "./utils/Structs.sol";
import "./utils/Enums.sol";
import "./Common/Transferer.sol";
import "./StakingNFT.sol";

/*сюда накинуть голосовалку и когда можно забирать из контракта
контракт заявки (DonationV1):
1. собирать донатную полоску (прогресс) в тех токенах, 
    в которых был запрос (v2 - предлагать юзерам любой токен, который свапается/бриджится) +
2. организовать голосовалку +-
    2.1 голосовалка:
    2.1.1 участники подтверждают вывод (в транзакции подверждается адрес вывода) +
    2.1.2 участники голосуют за смену адреса вывода
3. state заявок, их прогресс
4. access control, кто может добавлять/удалять заявки (голосовалка для менеджеров + админские полномочия)     

 */
 // State by stages
 enum FundraisingState {
    Pending,
    Dismissed,
    ApprovedByManagers,
    Complete,
    ApprovedByWithdrawers,
    Withdrawn
 }

 struct Donation {
    //uint id; // хранить ли в базе доп инфу по айди? что за доп инфа должна быть?
    uint totalNeeded;
    uint totalTransferred;
    address tokenAddress;
    address withdrawalAddress;
    address[] withdrawalApprovers;
    FundraisingState state;
}

struct Vote {
    bool hasVoted;
    bool voteResult;
}

struct Approval {
    uint managerApprovals;
    mapping(address => Vote) managersVote;
    uint withdrawalApprovals;
    mapping(address => bool) withdrawersApproved;
}

contract FundraisingV1 is Transferer, AccessControl {
    using Arrays for uint[];

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    uint fundraisingId = 0;
    mapping(uint => Donation) public donations;
    mapping(uint => Approval) public approvals;

    address[] public managers;

    StakingNFT public nft;

    modifier onlyVoted(uint _donationId) {
        Donation storage donation = donations[_donationId];
        _;
    }


    constructor(address[] memory _managers) {
        require(_managers.length > 1);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        uint length = _managers.length;
        for(uint index = 0; index < length; index++) {
            managers.push(_managers[index]);
            _grantRole(MANAGER_ROLE, managers[index]);
        }
        nft = new StakingNFT(); // fundraising owns
    }

    // settings
    function managersCount() public view returns(uint) {
        return managers.length;
    }

    function addManagers(address[] memory _managers) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for(uint index = 0; index < _managers.length; index++) {
            managers.push(_managers[index]);
            _grantRole(MANAGER_ROLE, managers[index]);
        }
    }

    event ManagerRemoved(address removedManager);
    function removeManagers(address[] memory _managers) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for(uint i = 0; i < _managers.length; i++) {
            for(uint j = 0; j < managers.length; j++) {
                if(_managers[i] == managers[j]) {
                    delete managers[j];
                    emit ManagerRemoved(_managers[i]);
                    for(uint k = j; k < managers.length - 1; k++)
                        managers[k] = managers[k + 1];
                    managers.pop();
                    break;
                }
            }
        }
    }
    // end of settings

    event Donated(uint donationId, uint totalTransferred);

    function donate(uint _donationId, address _tokenAddress, uint _amount) external payable {
        Donation storage donation = donations[_donationId];
        require(donation.totalNeeded > 0);
        require(donation.state == FundraisingState.ApprovedByManagers);
        // TODO: v2 - implement autoswap for user (with confirmation) and remove next line
        require(donation.tokenAddress == _tokenAddress);
        transferERC20TokenFrom(_tokenAddress, msg.sender, address(this), _amount);
        donation.totalTransferred += _amount;
        nft.createNFT(msg.sender);
        if(donation.totalTransferred >= donation.totalNeeded)
            donation.state = FundraisingState.Complete;

        emit Donated(_donationId, _amount);
    }

    // fundraising setup

    event FundRaised(uint fundraisingId);

    function registerFundrasing(
        uint _totalNeeded,
        address _tokenAddress, 
        address _withdrawalAddress, 
        address[] calldata _withdrawalApprovers
    ) external {
        Donation memory donation;
        donation.totalNeeded = _totalNeeded;
        donation.totalTransferred = 0;
        donation.tokenAddress = _tokenAddress;
        donation.withdrawalAddress = _withdrawalAddress;
        donation.withdrawalApprovers = _withdrawalApprovers;
        donations[fundraisingId++] = donation;
        emit FundRaised(fundraisingId - 1);
    }

    error ManagerAlreadyVoted();
    error PendingStateRequired();

    function _calculateDonationState(uint _donationId) internal {
        Approval storage approval = approvals[_donationId];
        uint notVoted = 0;
        uint voteForCount = 0;
        uint voteAgainstCount = 0;
        for(uint i = 0; i < managers.length; i++) {
            if(approval.managersVote[managers[i]].hasVoted) {
                if(approval.managersVote[managers[i]].voteResult)
                    voteForCount++;
                else 
                    voteAgainstCount++;
            }
            else 
                notVoted++;
        }

        if(voteAgainstCount >= voteForCount) {
            // possibility for left managers to vote yes and approve a fundraising
            if(notVoted > 0) {
                if(notVoted + voteForCount >= 2 * managers.length / 3) return;
            }
            console.log('Dismissed');
            donations[_donationId].state = FundraisingState.Dismissed;
            
        }
        else {
            // possibility for left managers to vote no and dismiss a fundraising
            if(notVoted > 0) {
                if(notVoted + voteAgainstCount > 1 * managers.length / 3) return;
            }
            console.log('ApprovedByManagers');
            donations[_donationId].state = FundraisingState.ApprovedByManagers;
        }
    }

    function approveFundraising(uint _donationId, bool isApproved) onlyRole(MANAGER_ROLE) external {
        Donation storage donation = donations[_donationId];

        if(donation.state != FundraisingState.Pending)
            revert PendingStateRequired();

        if(approvals[_donationId].managersVote[msg.sender].hasVoted) 
            revert ManagerAlreadyVoted();

        approvals[_donationId].managersVote[msg.sender].hasVoted = true;
        approvals[_donationId].managersVote[msg.sender].voteResult = isApproved;
        approvals[_donationId].managerApprovals++;

        _calculateDonationState(_donationId);
    }

    // end fundraising setup


    // withdrawal
    error WithdrawerAlreadyApproved();
    error NotWithdrawer();
    error NotComplete();

    function approveWithdrawal(uint _donationId) external {
        Donation storage donation = donations[_donationId];
        Approval storage approval = approvals[_donationId];

        if(donation.state < FundraisingState.Complete)
            revert NotComplete();

        if(approvals[_donationId].withdrawersApproved[msg.sender])
            revert WithdrawerAlreadyApproved();

        bool isWithdrawer = false;
        for (uint index = 0; index < donation.withdrawalApprovers.length; index++) {
            if(donation.withdrawalApprovers[index] == msg.sender) {
                isWithdrawer = true;
                break;
            }
        }

        if(!isWithdrawer)
            revert NotWithdrawer();

        approval.withdrawersApproved[msg.sender] = true;
        approval.withdrawalApprovals++;

        // 2/3 of approvers at least required to withdraw funds
        if(approval.withdrawalApprovals > 2 * donation.withdrawalApprovers.length / 3) 
            donation.state = FundraisingState.ApprovedByWithdrawers;
        
    }

    function withdrawFundraising(uint _donationId) external {
        Donation storage donation = donations[_donationId];
        bool isWithdrawer = false;
        for(uint i = 0; i < donation.withdrawalApprovers.length; i++)
            if(msg.sender == donation.withdrawalApprovers[i]) {
                isWithdrawer = true;
                break;
            }
        if(!isWithdrawer)
            revert NotWithdrawer();
        if(donation.state == FundraisingState.ApprovedByWithdrawers) 
            transferERC20TokenOrETH(donation.tokenAddress, donation.withdrawalAddress, donation.totalTransferred);
        donation.state = FundraisingState.Withdrawn;
    }
    // end of withdrawal

    receive() external payable {}
}
