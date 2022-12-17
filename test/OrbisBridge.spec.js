const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const utils = ethers.utils;

describe("OrbisBridge", function () {
  let orbisBridge;

  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const OrbisBridge = await ethers.getContractFactory("OrbisBridge");
    const orbisBridge = await OrbisBridge.deploy(owner.address);

    return { orbisBridge, owner, otherAccount };
  }

  beforeEach("deploy contracts", async () => {
    ({ owner, otherAccount, orbisBridge } = await loadFixture(deployFixture));
  });

  describe("#attestMint", function () {
    const data = "hello";
    const inBytes = utils.formatBytes32String(data);

    it("returns true", async function () {
      // STEP 1:
      // building hash has to come from system address
      // 32 bytes of data
      let messageHash = utils.solidityKeccak256(
        ["address", "address"],
        [owner.address, otherAccount.address]
      );

      // STEP 2: 32 bytes of data in Uint8Array
      let messageHashBinary = utils.arrayify(messageHash);

      // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      let signature = await owner.signMessage(messageHashBinary);

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
