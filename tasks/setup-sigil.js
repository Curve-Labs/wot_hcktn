task("setup:sigil", "Sets up a new sigil")
  .addParam("id", "The base uri to be used for token metadata")
  .addOptionalParam(
    "attestor",
    "The address of the attestor contract (optional)"
  )
  .setAction(async ({ attestor, id }, { deployments, ethers }) => {
    const ADDRESS_ONE = "0x1111111111111111111111111111111111111111";

    const TrustSigil = await deployments.get("TrustSigil");
    const trustSigil = await ethers.getContractAt(
      "TrustSigil",
      TrustSigil.address
    );

    let tx;

    attestor
      ? (tx = await trustSigil.setupSigil(id, attestor))
      : (tx = await trustSigil.setupSigil(id, ADDRESS_ONE));
  });
