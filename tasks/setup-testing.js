task(
  "setup:testing",
  "Deploys up a TrustSigil and sets up new sigil (tokenId = 1) with OrbisBridge as attestor"
).setAction(async (_, { run }) => {
  const baseUri = "ipfs://";
  const pkpAddress = "0xC5c8D3533cD0eB838c60AEeea5dF6fE23E34b67C";
  const tokenId = "1";

  const trustSigilAddress = await run("deploy:sigil", { base: baseUri });
  const orbisBridgeAddress = await run("deploy:orbis-bridge", {
    pkp: pkpAddress,
  });
  await run("setup:sigil", { id: tokenId, attestor: orbisBridgeAddress });

  console.log("Deployed TrustSigil to: ", trustSigilAddress);
  console.log("Deployed OrbisBridge to: ", orbisBridgeAddress);
  console.log(
    `Set up new sigil with tokenId ${tokenId} and trustAttestor ${orbisBridgeAddress}`
  );
});
