/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IDonation,
  IDonationInterface,
} from "../../../contracts/Interfaces/IDonation";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "foo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export class IDonation__factory {
  static readonly abi = _abi;
  static createInterface(): IDonationInterface {
    return new Interface(_abi) as IDonationInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IDonation {
    return new Contract(address, _abi, runner) as unknown as IDonation;
  }
}
