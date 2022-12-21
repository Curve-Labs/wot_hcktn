task("deploy:orbis-bridge", "Deploys an instance of OrbisBridge")
  .addParam("pkp", "The address of the pkp")
  .setAction(async ({ pkp }, { ethers, deployments }) => {
    const [owner] = await ethers.getSigners();
    const { deploy } = deployments;
    const { address } = await deploy("OrbisBridge", {
      args: [pkp],
      from: owner.address,
    });

    return address;
  });
