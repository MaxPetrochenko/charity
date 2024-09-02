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
    в которых был запрос (v2 - предлагать юзерам любой токен, который свапается/бриджится)
2. организовать голосовалку 
    2.1 голосовалка:
    2.1.1 участники подтверждают вывод (в транзакции подверждается адрес вывода)
    2.1.2 участники голосуют за смену адреса вывода
3. state заявок, их прогресс
4. access control, кто может добавлять/удалять заявки (голосовалка для менеджеров + админские полномочия)     

 */
 struct Donation {
    //uint id; // хранить ли в базе доп инфу по айди? что за доп инфа должна быть?
    uint totalNeeded;
    uint totalTransferred;
    address tokenAddress;
    address withdrawalAdress;
}

contract ESDonation is Transferer, AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    uint donationIndex = 0;
    uint pendingIndex = 0;
    mapping(uint => Donation) donations;
    mapping(uint => Donation) pendingDonations;
    mapping(uint => uint) approvals;
    
    address[] managers;


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
            emit FundRaised(_donationId, donation.totalTransferred);
        }
    }

    function withdrawFundrasing() external {
        // 1. managers approval
        // 2. user(s) approval
        // 3. withdraw to withdrawAddress
    }

    function registerFundrasing(Donation calldata _donation) external {
        pendingDonations[pendingIndex++] = Donation(
            _donation.totalNeeded,
            0, 
            _donation.tokenAddress, 
            _donation.withdrawalAdress
        );
    }

    function approveDonation(uint _donationId) onlyRole(MANAGER_ROLE) external {
        approvals[_donationId]++;
        if(approvals[_donationId] > 2 * managers.length / 3) {
            registerDonation(pendingDonations[_donationId]);
            delete pendingDonations[_donationId];
        }
    }

    // должна производиться через 4. access control, кто может добавлять/удалять заявки (голосовалка для менеджеров + админские полномочия)   
    function registerDonation(Donation storage _donation) internal {
        donations[donationIndex++] = _donation; //Donation(_donation.totalNeeded, 0, _donation.tokenAddress);
    }

    receive() external payable {}
}
