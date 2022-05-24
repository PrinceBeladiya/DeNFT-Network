require("@nomiclabs/hardhat-waffle");

const secrets = require("./secrets.json");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.18"
      },
      {
        version: "0.8.4"
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${secrets.AlchemyMumbaiAPIkey}`,
      accounts: {
        mnemonic: secrets.Mnemonic
      }
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${secrets.InfuraAPI}`,
      accounts: {
        mnemonic: secrets.Mnemonic
      }
    },
    metis: {
      url: "https://stardust.metis.io/?owner=588",
      accounts: {
        mnemonic: secrets.Mnemonic
      }
    },
    bobarinkeby: {
      url: 'https://rinkeby.boba.network',
      chainId: 28,
      accounts: {
        mnemonic: secrets.Mnemonic
      }
    },
    metertestnet: {
      url: 'https://rpctest.meter.io',
      chainId: 83,
      accounts: {
        mnemonic: secrets.Mnemonic
      }
    },
  },

  paths: {
    artifacts: "./denft-frontend/src/contracts"
  }
};
