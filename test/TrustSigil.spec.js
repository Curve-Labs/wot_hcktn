const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("TrustSigil", function () {
  const trustSigilBaseUri = "www.trustsigil.com/";

  let trustSigil;

  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const TrustSigil = await ethers.getContractFactory("TrustSigil");
    const trustSigil = await TrustSigil.deploy(trustSigilBaseUri);

    return { trustSigil, owner, otherAccount };
  }

  beforeEach("deploy contracts", async () => {
    ({ owner, otherAccount, trustSigil } = await loadFixture(deployFixture));
  });

  describe("#setupSigil", function () {
    const tokenId = 1;
    const addressOne = "0x1111111111111111111111111111111111111111";

    it("sets trust attestor for tokenId", async function () {
      await trustSigil.setupSigil(tokenId, addressOne);

      expect(await trustSigil.trustAttestors(tokenId)).to.equal(addressOne);
    });
  });

  describe("#mintSigil", function () {
    const tokenId = 1;
    const emptyData = 0x0;

    context("with addressOne set as attestor", () => {
      const addressOne = "0x1111111111111111111111111111111111111111";

      beforeEach("setup sigil", async () => {
        await trustSigil.setupSigil(tokenId, addressOne);
      });

      it("mints", async function () {
        await trustSigil.mintSigil(otherAccount.address, tokenId, emptyData);

        expect(
          await trustSigil.balanceOf(otherAccount.address, tokenId)
        ).to.equal(1);
      });
    });
  });
});
