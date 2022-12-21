require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

require("./tasks/deploy-sigil");
require("./tasks/setup-sigil");
require("./tasks/deploy-orbis-bridge");
require("./tasks/setup-testing");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};
