import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DDNS", (m) => {
  const ddns = m.contract("DDNS");
  return { ddns };
});