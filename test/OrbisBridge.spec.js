const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, config } = require("hardhat");
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

      // STEP 3: get signature (= test specific, not suitable for prod)
      const { accounts } = config.networks.hardhat;
      const wallet1 = ethers.Wallet.fromMnemonic(
        accounts.mnemonic,
        accounts.path + `/0`
      );
      const privateKey1 = wallet1.privateKey;
      const signingKey = new ethers.utils.SigningKey(privateKey1);
      const expandedSig = signingKey.signDigest(messageHashBinary);
      const signature = ethers.utils.joinSignature(expandedSig);

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
