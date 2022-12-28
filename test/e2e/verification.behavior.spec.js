const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, run } = require("hardhat");

describe.only("Lit", function () {
  let orbisBridge;

  const pkpAddress = "0xC5c8D3533cD0eB838c60AEeea5dF6fE23E34b67C";
  const pkpPubKey =
    "0x04f4aae20fc84fcc515f1c1cb17cadfe75845c1ea9e478fdd5b3c7be4f7098e62957c4cdee9df6d43d094951dcdde468684e1b847758826bc17a2a2d0b56108e17";

  async function deployFixture() {
    const [owner, other] = await ethers.getSigners();
    const OrbisBridge = await ethers.getContractFactory("OrbisBridge");
    const orbisBridge = await OrbisBridge.deploy(pkpAddress);

    return { orbisBridge, owner, other };
  }

  beforeEach("deploy contracts", async () => {
    ({ owner, other, orbisBridge } = await loadFixture(deployFixture));
  });

  describe("#attestMint", function () {
    it("returns true", async function () {
      const signature = await run("verify:pkp:sig", {
        address1: owner.address,
        address2: other.address,
        pkp: pkpPubKey,
      });

      expect(
        await orbisBridge.attestMint(owner.address, other.address, signature)
      ).to.equal(true);
    });
  });
});
