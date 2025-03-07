require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks:{
    ganache: {
      url: 'http://localhost:7545',
      chainId: 1337,
      accounts: {
        mnemonic: '' // Add your mnemonic here
      }
    }
  }
};
