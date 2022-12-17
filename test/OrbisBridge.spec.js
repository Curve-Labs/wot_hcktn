const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const utils = ethers.utils;

describe("OrbisBridge", function () {
  let orbisBridge;

  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const OrbisBridge = await ethers.getContractFactory("OrbisBridge");
    const orbisBridge = await OrbisBridge.deploy();

    return { orbisBridge, owner, otherAccount };
  }

  beforeEach("deploy contracts", async () => {
    ({ owner, otherAccount, orbisBridge } = await loadFixture(deployFixture));
  });

  describe("#verify", function () {
    const data = "hello";
    const inBytes = utils.formatBytes32String(data);

    it("sets trust attestor for tokenId", async function () {
      const signedMssage = await owner.signMessage(inBytes);

      console.log(
        await orbisBridge.verify(inBytes, signedMssage, owner.address)
      );
      //   expect(await trustSigil.trustAttestors(tokenId)).to.equal(addressOne);
    });
  });
});
