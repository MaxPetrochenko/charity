import FundraisingContract from "../../../hardhat/artifacts/contracts/Fundraising.sol/FundraisingV1.json";
import {
  FundraisingV1__factory,
  FundraisingV1,
} from "../../../hardhat/typechain-types";
import { ethers } from "ethers";

export type { FundraisingV1 };
export default { FundraisingContract };
