// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Interfaces/IESStaking.sol";
import "./Interfaces/IESDonation.sol";
import "./utils/Structs.sol";
import "./utils/Enums.sol";
import "./Common/Transferer.sol";

/*сюда накинуть голосовалку и когда можно забирать из контракта
контракт заявки (ESDonation):
1. собирать донатную полоску (прогресс) в тех токенах, 
    в которых был запрос (v2 - предлагать юзерам любой токен, который свапается/бриджится) +
2. организовать голосовалку +-
    2.1 голосовалка:
    2.1.1 участники подтверждают вывод (в транзакции подверждается адрес вывода) +
    2.1.2 участники голосуют за смену адреса вывода
3. state заявок, их прогресс
4. access control, кто может добавлять/удалять заявки (голосовалка для менеджеров + админские полномочия)     

 */
 enum DonationState {
    Pending,
    Registered,
    Dismissed,
    Complete,
    ApprovedByWithdrawers,
    ApprovedByManagers
 }

 struct Donation {
    //uint id; // хранить ли в базе доп инфу по айди? что за доп инфа должна быть?
    uint totalNeeded;
    uint totalTransferred;
    address tokenAddress;
    address withdrawalAddress;
    address[] withdrawalApprovers;
    DonationState state;
}


//TODO
//разобраться с аппрувами (аппрув заявки, аппрув виздро, ручная  отправка не нужна, а значит и не нужны другие аппрувы. стейт пока оставим)
//delete pendingDonations
struct Approval {
    uint managerApprovals;
    uint withdrawalApprovals;
    mapping(address => bool) managersApproved;
    mapping(address => bool) withdrawersApproved;
}

struct SSApproval {
    uint approvals;
    mapping(address => bool) approved;
}

contract ESDonation is Transferer, AccessControl {
    using Arrays for uint[];

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    uint donationIndex = 0;
    mapping(uint => Donation) donations;
    mapping(uint => Approval) approvals;

    address[] managers;

    modifier onlyVoted(uint _donationId) {
        Donation storage donation = donations[_donationId];
        _;
    }


    constructor(address[] memory _managers) {
        require(managers.length > 1);
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(MANAGER_ROLE, msg.sender);
        uint length = _managers.length;
        for (uint256 index = 0; index < length; index++) {
            grantRole(MANAGER_ROLE, _managers[index]);
            managers.push(_managers[index]);
        }
    }

    function addManagers(address[] memory _managers) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint length = _managers.length;
        for (uint256 index = 0; index < length; index++) {
            grantRole(MANAGER_ROLE, _managers[index]);
            managers.push(_managers[index]);
        }
    }

    event FundRaised(uint donationId, uint totalTransferred);

    function donate(uint _donationId, address _tokenAddress, uint _amount) external payable {
        Donation storage donation = donations[_donationId];
        require(donation.totalNeeded > 0);
        // TODO: v2 - implement autoswap for user (with confirmation) and remove next line
        require(donation.tokenAddress == _tokenAddress); 
        transferERC20TokenOrETH(_tokenAddress, address(this), _amount);
        // TODO: send nft for donation
        donation.totalTransferred += _amount;
        if(donation.totalTransferred >= donation.totalNeeded) {
            donation.state = DonationState.Complete;
            emit FundRaised(_donationId, donation.totalTransferred);
        }
    }

    function withdrawFundrasing() external {
        // 1. managers approval
        // 2. user(s) approval
        // 3. withdraw to withdrawAddress
    }

    function registerFundrasing(uint totalNeeded, address tokenAddress, address withdrawalAddress, address[] calldata withdrawalApprovers) external {
        donations[donationIndex++] = Donation(
            totalNeeded,
            0, 
            tokenAddress, 
            withdrawalAddress,
            withdrawalApprovers,
            DonationState.Pending
        );
    }

    error ManagerAlreadyApproved();
    error PendingStateRequired();

    function voteForFundRaising(uint _donationId, bool isApproved) onlyRole(MANAGER_ROLE) external {
        Donation storage donation = donations[_donationId];

        if(donation.state != DonationState.Pending)
            revert PendingStateRequired();

        if(approvals[_donationId].managersApproved[msg.sender])
            revert ManagerAlreadyApproved();
        
        (bool result, uint votes) = voteForFund(_donationId, isApproved);

        // if(approvals[_donationId].managersApproved[msg.sender])
        //     revert ManagerAlreadyApproved();
        approvals[_donationId].managersApproved[msg.sender] = true;
        approvals[_donationId].managerApprovals++;

        // approvals[_donationId].managerApprovals++;
        // approvals[_donationId].managersApproved[msg.sender] = true;
        if(approvals[_donationId].managerApprovals > 2 * managers.length / 3) {
            donation.state = DonationState.ApprovedByManagers;
        }
    }

    function voteForFund(uint _donationId, bool isApproved) internal returns(bool, uint) {
        
    }

    error WithdrawerAlreadyApproved();
    error TransferredLessThanNeeded();
    error NotWithdrawer();
    error ManagersNotApproved();

    function approveWithdrawal(uint _donationId) external {
        Donation storage donation = donations[_donationId];
        Approval storage approval = approvals[_donationId];
        if(donation.totalTransferred < donation.totalNeeded)
            revert TransferredLessThanNeeded();
        if(donation.state != DonationState.ApprovedByManagers) {
            revert ManagersNotApproved();
        }
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

        // approvals[_donationId].withdrawalApprovals++;
        // approvals[_donationId].withdrawersApproved[msg.sender] = true;

        // 2/3 of approvers at least required to withdraw funds
        if(approval.withdrawalApprovals > 2 * donation.withdrawalApprovers.length / 3) {
            donation.state = DonationState.ApprovedByWithdrawers;
            //transfer to withdrawalAddress
            //or use FROM
            transferERC20TokenOrETH(donation.tokenAddress, donation.withdrawalAddress, donation.totalTransferred);
        }
    }

    // должна производиться через 4. access control, кто может добавлять/удалять заявки (голосовалка для менеджеров + админские полномочия)   
    

    receive() external payable {}
}
