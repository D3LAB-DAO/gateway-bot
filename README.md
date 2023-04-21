# Gateway Bot

This is a Node.js application that monitors new requests for projects and executes them. It retrieves requests from a smart contract, runs a script with input parameters, and saves the execution result to the smart contract.

# Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file and set the following environment variables:
- RPC_URL: the URL of the RPC endpoint for the Cosmos network
- CONTRACT_ADDRESS: the address of the smart contract to monitor
- MNEMONIC: the mnemonic phrase for the wallet that will sign transactions
- RUN_ENDPOINT: the URL of the script execution endpoint

# Usage
To start the bot, run the command `npm start` in the terminal. The bot will continuously monitor for new requests and execute them as they are found.
