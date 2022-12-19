task("deploy:sigil", "Deploys an instance of TrustSigil")
  .addParam("base", "The base uri to be used for token metadata")
  .setAction(async ({ base }, { ethers, deployments }) => {
    const [owner] = await ethers.getSigners();
    const { deploy } = deployments;
    await deploy("TrustSigil", { args: [base], from: owner.address });
  });
