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

## API
The bot exposes an API that can be used to retrieve project execution results. The API has the following endpoint:

```
/api/project/:projectId
```

This endpoint accepts a `projectId` parameter and returns the execution result of the project with the specified ID. If the project is not found or there is no result, the API will return a `null`.

Example usage:

```bash
$ curl http://localhost:3327/api/123

{"data":"{\"result\":\"Project Gateway is a groundbreaking solution designed to bridge the gap between Web 2.0 and Web 3.0, built on the Archway platform.\"}"}
```

This command sends a GET request to the API endpoint with a `projectId` parameter of `123`.
