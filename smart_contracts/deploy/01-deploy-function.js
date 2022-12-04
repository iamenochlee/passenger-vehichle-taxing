const { network, ethers } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();

const INTERVAL = process.env.INTERVAL;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  // const [, account2] = await ethers.getSigners();
  const chainId = network.config.chainId;
  // console.log({ deployer: deployer, account2: account2.address });

  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  log("----------------------------------------------------");
  log("Deploying PassengerVehichleTaxing and waiting for confirmations...");
  const PassengerVehichleTaxing = await deploy("PassengerVehichleTaxing", {
    from: deployer,
    args: [ethUsdPriceFeedAddress, INTERVAL],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(
    "PassengerVehichleTaxing contract deployed at ",
    PassengerVehichleTaxing.address
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(PassengerVehichleTaxing.address, [
      ethUsdPriceFeedAddress,
      INTERVAL,
    ]);
  }
};

module.exports.tags = ["all", "PassengerVehichleTaxing"];
