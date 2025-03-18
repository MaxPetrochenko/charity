import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployModule = buildModule("Deploy", (m) => {
  const account = m.getAccount(0);
  const manager1 = m.getAccount(1);
  const manager2 = m.getAccount(2);
  const fundraising = m.contract(
    "FundraisingV1",
    [[account, manager1, manager2]],
    {
      from: account,
    }
  );

  const mockToken = m.contract("MockERC20Ownable", ["MockERC20", "ERC20"], {
    from: account,
  });
  return { fundraising, mockToken };
});

export default DeployModule;
