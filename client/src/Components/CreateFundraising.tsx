import React, { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import FundraisingContract, { FundraisingV1 } from "../Contracts/Fundraising";
import { FundraisingV1__factory } from "../typechain";
import axiosInstance from "../utils/axiosInstance";

declare global {
  interface Window {
    ethereum: any;
  }
}
let signer: ethers.JsonRpcSigner;
let isSigned: boolean = false;

export const CreateFundraisingForm: React.FC = () => {
  // Step 1: Set up state variables for each input field
  const [formData, setFormData] = useState({
    goal: "",
    description: "",
    title: "",
    isSigned: false,
    signer: {},
  });
  const handleGoal = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    e.target.value = value.replace(/[^0-9]/g, "");
    handleChange(e);
  };
  // Step 2: Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, // spread the existing state
      [name]: value, // update the specific field
    });
  };

  // Step 3: Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    console.log("Form submitted:", formData);
    const p = await axiosInstance.post("/api/fundraising/create", formData);
    console.log(p.data);
    const fundraisingInstance = await FundraisingV1__factory.connect(
      process.env.REACT_APP_FUNDRAISING_ADDRESS!,
      signer
    );
    const fund = await fundraisingInstance.registerFundrasing(
      ethers.parseUnits("10000"),
      process.env.REACT_APP_MOCK_TOKEN_ADDRESS!,
      signer.address,
      [signer.address]
    );

    const receipt = await fund.wait();
    // You can now send the formData to an API or process it further
  };

  const connectWallet = async () => {
    let provider;
    const { ethereum } = window;
    if (!ethereum) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed,
      // so they only have read-only access
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new BrowserProvider(ethereum);

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      const accounts = await provider.send("eth_accounts", []);
      const currentAccount = accounts[0];
      console.log(currentAccount);
      signer = await provider.getSigner();
      isSigned = true;
      setFormData({
        ...formData, // spread the existing state
        signer: signer, // update the specific field
        isSigned: isSigned,
      });
      console.log(signer);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name input */}
      <input
        type="text"
        name="title"
        value={formData.title} // Binding the input to state
        onChange={handleChange} // Updating the state when the user types
        placeholder="Fundraising Title"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="goal"
        placeholder="Fundraising Goal (amount of ETH)"
        value={formData.goal}
        onChange={handleGoal}
        required
      />

      <button
        type="button"
        onClick={connectWallet}
        id="btnConnect"
        hidden={formData.isSigned}
      >
        Connect Wallet
      </button>
      <button type="submit" hidden={!formData.isSigned}>
        Create Fundraising
      </button>
    </form>
  );
};

const CreateFundraisingPage = () => {
  return (
    <ProtectedRoute>
      <div className="fundraising-form">
        <h2>Create New Fundraising</h2>
        <CreateFundraisingForm />
      </div>
    </ProtectedRoute>
  );
};
export default CreateFundraisingPage;
