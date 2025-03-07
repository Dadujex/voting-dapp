# Voting dApp

A decentralized voting application built with Solidity smart contracts and a React frontend. This project allows users to create topics, vote on options within those topics, and view real-time results using blockchain technology.

## Project Structure

- **voting-contract/**: Contains the Solidity smart contract (`Voting.sol`) and Hardhat configuration for deployment and testing.
- **voting-dapp-frontend/**: A React-based user interface that interacts with the smart contract using Web3.js.

## Features

- Create new voting topics with custom options.
- Cast votes on any topic (one vote per account per topic).
- View real-time vote counts updated via blockchain events.
- Persistent data storage on the blockchain.
- Simple and responsive UI.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MetaMask](https://metamask.io/) browser extension
- A local Ethereum network (e.g., Hardhat) or a testnet (e.g., Ganache)

## Installation

### 1. Clone the Repository

- ```bash
  git clone <repository-url>
  cd voting-dapp

### 2. Install Dependencies

- **Smart contract**
    - ```bash
        cd voting-contract
        npm install
- **Frontend**
    - ```bash
        cd ../voting-dapp-frontend
        npm install

### Configure Environment

- **Smart Contract:** Ensure your Hardhat configuration (hardhat.config.js) is set up for your network (e.g., localhost).

- **Frontend:** Update the CONTRACT_ADDRESS in voting-dapp-frontend/src/config.js after deploying the smart contract (see below).

## Hardhat Configuration (for Ganache)

- In your `voting-contract/hardhat.config.js`, add the mnemonic from ganache.

## Smart Contract Deployment

### 1. Start Ganache

- Open Ganache and start a new workspace. This will run a local Ethereum network at http://localhost:7545

### 2. Deploy the smart contract

- In a new terminal window:
    - ```bash   
        cd voting-contract
        npx hardhat run scripts/deploy.js --network localhost
- Copy the deployed contract address from the console output (e.g., Voting deployed to: 0x...).

### 3.Update the frontend configuration

- Open voting-dapp-frontend/src/config.js and set:
    - ```javascript
        export const CONTRACT_ADDRESS = '0x...'; // Replace with your deployed contract address

## Running the Application

### 1.Start the Hardhat node (if not already running)

- ```bash
    cd voting-contract
    npx hardhat node

### 2. Launch the frontend

- ```bash
    cd voting-dapp-frontend
    npm run dev

- Open your browser at http://localhost:5173 (or the port shown in the terminal).

### Connect MetaMask

- Ensure MetaMask is connected to the Hardhat network (http://127.0.0.1:8545, chain ID: 31337).

- Import one of the Hardhat node's test accounts using its private key (shown in the npx hardhat node output). Or send ETH to your wallet with the script (see `voting-contract/scripts/sendEth.js` for an example).



