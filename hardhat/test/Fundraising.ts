import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import Enum from "./utils/utils";
import {ethers} from "hardhat";


function log(message: any, obj?: any[]) {
  obj === undefined? console.log(message) : console.log(message, obj);
} 

describe("Fundraising", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function deploy() {
    
    const [Alice, Bob, Clayton, Dave, Donater, Withdrawer_1, Withdrawer_2] = await hre.ethers.getSigners();

    const Fundraising = await hre.ethers.getContractFactory("FundraisingV1");
    const fundraising = await Fundraising.deploy([Alice, Bob, Clayton], {from: Alice.address});

    const MockToken = await hre.ethers.getContractFactory("MockERC20Ownable", Alice);
    const mock = await MockToken.deploy('Token for first Fundraising', 'FRST');

    return { fundraising, mock, Alice, Bob, Clayton, Dave, Donater, Withdrawer_1, Withdrawer_2 };
  }


  describe('Setup: ', () => {
    describe('#registerFundraising', () => {
      it('Should register new fundraising', async () => {
        const { fundraising, mock, Bob, Clayton} = await loadFixture(deploy);
        const _Bob = fundraising.connect(Bob);
        const number_ = ethers.toNumber(5n * 10n ** 12n);
        await expect(_Bob.registerFundrasing(number_, await mock.getAddress(), Bob.address, [Bob, Clayton]))
        .to.emit(fundraising, 'FundRaised')
        .withArgs(0);
        //expect((await _Bob.donations(0))[4])
      });
    });
    
    describe('#approveFundraising', () => {
      it('Should approve fundraising', async () => {
        const { fundraising, mock, Bob, Clayton, Withdrawer_1, Withdrawer_2} = await loadFixture(deploy);
        const _Bob = fundraising.connect(Bob);
        const number_ = ethers.toNumber(5n * 10n ** 12n);
        await _Bob.registerFundrasing(number_, await mock.getAddress(), Withdrawer_1.address, [Withdrawer_1.address, Withdrawer_2.address]);
        const _Clayton = fundraising.connect(Clayton);
        await expect(_Clayton.approveFundraising(0, true)).not.to.be.reverted;
        const approval = await _Clayton.approvals(0);
        expect(approval[0]).eq(1);
      });
    });
  });
  describe('Settings:', () => {
    it('Should add managers', async () => {
      const { fundraising, Alice, Dave} = await loadFixture(deploy);
      const contract = await fundraising.connect(Alice);
      const managersLengthBefore = await contract.managersCount();
      await contract.addManagers([Dave.address]);
      const managersLengthAfter = await contract.managersCount();
      expect(managersLengthAfter - managersLengthBefore).eq(1);
    });

    it('Should remove managers', async () => {
      const { fundraising, Alice, Bob} = await loadFixture(deploy);
      const contract = await fundraising.connect(Alice);
      const managersLengthBefore = await contract.managersCount();
      log(managersLengthBefore);
      await expect(contract.removeManagers([Bob.address])).to.emit(fundraising, 'ManagerRemoved').withArgs(Bob.address);
      const managersLengthAfter = await contract.managersCount();
      const bob = await contract.managers(1);
      log(bob);
      log(managersLengthAfter);
      expect(managersLengthBefore - managersLengthAfter).eq(1);
    });
  });
  describe('#approveWithdrawal', () => {
    it('Should approve withdrawal', async () => {
      const { fundraising, mock, Alice, Bob, Clayton, Donater, Withdrawer_1, Withdrawer_2} = await loadFixture(deploy);
      await fundraising.connect(Alice).
        registerFundrasing(10000, await mock.getAddress(), Withdrawer_1.address, [Withdrawer_1.address, Withdrawer_2.address]);;
      await fundraising.connect(Alice).approveFundraising(0, true);
      await fundraising.connect(Bob).approveFundraising(0, true);
      //await fundraising.connect(Clayton).approveFundraising(0, true);
      await mock.connect(Alice).mint(Donater.address, 1000000);
      await mock.connect(Donater).approve(fundraising, 10000);
      await fundraising.connect(Donater).donate(0, await mock.getAddress(), 10000);
      await expect(fundraising.connect(Withdrawer_1).approveWithdrawal(0)).not.to.be.reverted;
      //await fundraising.connect(Withdrawer_2).approveWithdrawal(0);
    });
  });
});