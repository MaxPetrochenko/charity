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
  typeof(obj) == undefined? console.log(message) : console.log(message, obj);
} 

describe("Fundraising", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function deploy() {
    
    const [Alice, Bob, Clayton, Dave] = await hre.ethers.getSigners();

    const Fundraising = await hre.ethers.getContractFactory("FundraisingV1");
    const fundraising = await Fundraising.deploy([Alice, Bob, Clayton, Dave], {from: Alice.address});

    const MockToken = await hre.ethers.getContractFactory("MockERC20Ownable", Alice);
    const mock = await MockToken.deploy('Token for first Fundraising', 'FRST');

    return { fundraising, mock, Alice, Bob, Clayton, Dave };
  }


  describe("Setup: ", function () {
    it("Should register new fundraising", async function () {
      const { fundraising, mock, Bob, Clayton} = await loadFixture(deploy);
      const _Bob = fundraising.connect(Bob);
      //const number_ = ethers.toNumber(5n * 10n ** 18n);
      await expect(_Bob.registerFundrasing(1, await mock.getAddress(), Bob.address, [Bob, Clayton]))
      .to.emit(fundraising, 'FundRaised')
      .withArgs(0);
      //expect((await _Bob.donations(0))[4])
    });

    it("Should approve fundraising", async () => {
        const { fundraising, mock, Bob, Clayton} = await loadFixture(deploy);
        const _Bob = fundraising.connect(Bob);
        //const number_ = ethers.toNumber(5n * 10n ** 18n);
        await _Bob.registerFundrasing(1, await mock.getAddress(), Bob.address, [Bob, Clayton]);
        const don_ = await _Bob.donations(0);
        log(don_);
        //log('--------------')
        const _Clayton = fundraising.connect(Clayton);
        await expect(_Clayton.approveFundraising(0)).not.to.be.reverted;
        const don = await _Clayton.donations(0);
        //log(don);
        expect(don[4]).eq(5);
    });

  });
});
