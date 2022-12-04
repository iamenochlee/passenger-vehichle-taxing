require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@primitivefi/hardhat-dodoc");
require("@nomiclabs/hardhat-solhint");
require("solidity-coverage");
require("hardhat-abi-exporter");

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "0x00";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x00";
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2 || "0x00";
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "0x00";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "0x00";
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL || "0x00";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "0x00";
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: {
    compilers: [{ version: "0.8.17" }, { version: "0.6.0" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY2],
      chainId: 5,
    },
    polygonMumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      chainId: 80001,
      accounts: [PRIVATE_KEY, PRIVATE_KEY2],
    },
  },

  etherscan: {
    apiKey: {
      //ethereum
      goerli: ETHERSCAN_API_KEY,
      //polygon
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    gasPriceApi: COINMARKETCAP_API_KEY,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: false,
    token: "MATIC",
  },
  dodoc: {
    runOnCompile: true,
    exclude: ["contracts/tests", "k", "console"],
  },
  abiExporter: {
    path: "../frontend/constants/",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: ["PassengerVehichleTaxing"],
    spacing: 2,
    format: "json",
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};
