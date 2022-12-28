const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, run } = require("hardhat");
const utils = ethers.utils;

describe.only("Lit", function () {
  let orbisBridge;
  const pkp = "0xC5c8D3533cD0eB838c60AEeea5dF6fE23E34b67C";

  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const OrbisBridge = await ethers.getContractFactory("OrbisBridge");
    const orbisBridge = await OrbisBridge.deploy(pkp);

    return { orbisBridge, owner, otherAccount };
  }

  beforeEach("deploy contracts", async () => {
    ({ owner, otherAccount, orbisBridge } = await loadFixture(deployFixture));
  });

  describe("#attestMint", function () {
    const data = "hello";
    const inBytes = utils.formatBytes32String(data);

    it("returns true", async function () {
      const litResponse = await run("verify:pkp:sig");
      const signature = litResponse.signatures.sig1.signature;
      //   // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      //   let signature = await owner.signMessage(messageHashBinary);
      expect(
        await orbisBridge.attestMint(
          owner.address,
          otherAccount.address,
          signature
        )
      ).to.equal(true);
    });
  });
});
