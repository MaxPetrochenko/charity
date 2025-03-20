import { useAuth } from "../Context/AuthContext";
import { UserRole } from "../Context/AuthContext";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import { FundraisingV1__factory } from "../typechain";
import { FundraisingStatusEnum } from "../utils/enums";

const MainPage = () => {
  const { role } = useAuth();
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [fundraisings, setFundraisings] = useState<any[]>([]);

  useEffect(() => {
    if (signer) {
      fetchFundraisings(role);
    }
  }, [signer, role]);

  const fetchFundraisings = async (userRole: UserRole) => {
    try {
      const fundraising = FundraisingV1__factory.connect(
        process.env.REACT_APP_FUNDRAISING_ADDRESS!,
        signer!
      );

      let requestStatuses: FundraisingStatusEnum[] = [];
      switch (role) {
        case UserRole.user:
          requestStatuses.push(FundraisingStatusEnum.ApprovedByManagers);
          break;
        case UserRole.manager:
          requestStatuses.push(FundraisingStatusEnum.Pending);
          break;
        case UserRole.admin:
          requestStatuses.push(
            FundraisingStatusEnum.Pending,
            FundraisingStatusEnum.ApprovedByManagers,
            FundraisingStatusEnum.Dismissed
          );
          break;
        default:
          requestStatuses.push(FundraisingStatusEnum.ApprovedByManagers);
          break;
      }

      const response = await axiosInstance.post("/api/fundraising/approved", {
        requestStatuses,
      });

      setFundraisings(response.data);
    } catch (error) {
      console.error("Error fetching fundraisings:", error);
    }
  };

  const connectWallet = async () => {
    try {
      let provider;
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider();
      } else {
        provider = new BrowserProvider(ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const currentAccount = accounts[0];
          console.log("Connected:", currentAccount);
          const signerInstance = await provider.getSigner();
          setSigner(signerInstance);
          setIsSigned(true);
        } else {
          console.warn("No accounts found. Please connect your wallet.");
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div>
      {!isSigned ? (
        <button type="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="fundraisers-list">
          <h1>Approved Fundraisers</h1>
          {fundraisings.length > 0 ? (
            fundraisings.map((fundraiser, index) => (
              <div key={index} className="fundraiser-item">
                <h3>{fundraiser.title}</h3>
                <p>{fundraiser.description}</p>
                <p>Goal: {fundraiser.goal} ETH</p>
                <button>Donate</button>
              </div>
            ))
          ) : (
            <p>No fundraisers available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MainPage;
