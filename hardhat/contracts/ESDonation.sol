// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
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
contract ESDonation is Transferer {
    function foo(address tokenAddress, uint amount) external payable {
        assert(amount > 0);
    }

    function donate(address tokenAddress, address to, uint amount) external payable {
        transferERC20TokenOrETH(tokenAddress, to, amount);

    }

    receive() external payable {}
}
