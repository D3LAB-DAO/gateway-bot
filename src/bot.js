const axios = require('axios');

const { Secp256k1HdWallet } = require("@cosmjs/amino");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { calculateFee, GasPrice } = require("@cosmjs/stargate");

require("dotenv").config();

// Load environment variables
const rpcUrl = process.env.RPC_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;
const mnemonic = process.env.MNEMONIC;
const runUrl = process.env.RUN_ENDPOINT;

let senderAddress;

const gasPrice = GasPrice.fromString("0.025uconst");

// Define the bot function
async function bot() {
    // Create a wallet instance from the mnemonic
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "archway" });

    // Choose the account you want to use from the wallet
    const [{ address, pubkey }] = await wallet.getAccounts();
    senderAddress = address;

    // Configure the client to use the account for signing transactions
    const client = await SigningCosmWasmClient.connectWithSigner(rpcUrl, wallet);

    // Loop continuously to monitor new requests and execute them
    while (true) {
        console.log("Monitor...");

        // Get the latest request for the specified project
        const projCount = await getProjectCount(client);
        // console.log(projCount);

        for (let i = 1; i <= projCount; i++) {
            const res = await getRequest(client, i);
            const requests = res.request;
            const scriptUrl = res.github_addr;

            for (let j = 0; j < requests.length; j++) {
                const request = requests[j];
                console.log("Proj", i, "Req:", request);

                try {
                    let result = await runScript(
                        scriptUrl,
                        JSON.parse(request.input)
                    );
                    // console.log(result.result);
                    const execRes = await saveExecResult(
                        client, i, request, JSON.stringify(result)
                    );
                    console.log("Res:", JSON.stringify(result));
                    console.log("TX:", execRes.transactionHash);
                } catch (error) {
                    const execRes = await saveExecResult(
                        client, i, request, "INVALID_SCRIPT_OR_INPUTS"
                    );
                    console.log("Res:", "INVALID_SCRIPT_OR_INPUTS");
                    console.log("TX:", execRes.transactionHash);
                }
            }
        }

        // Wait for 5 seconds before checking for new requests again
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

async function getProjectCount(client) {
    const queryResult = await client.queryContractSmart(contractAddress, {
        "Config": {},
    });
    return queryResult.count;
}

async function getRequest(client, projId) {
    const queryResult = await client.queryContractSmart(contractAddress, {
        "ProjectInfo": { "id": projId },
    }); // get Project count, start from 1

    // If a new request is found, return it, otherwise return null
    return queryResult ? queryResult : null;
}

async function runScript(url, inputParameters) {
    const headers = {
        'Content-Type': 'application/json',
    };
    try {
        const response = await axios.post(
            runUrl,
            {
                url,
                inputParameters
            },
            { headers }
        );
        // return response.data.result;
        return response.data;
    } catch (error) {
        // console.error(error);
    }
}

async function saveExecResult(client, projId, request, result) {
    const executeFee = calculateFee(300_000, gasPrice);

    // Construct the message for the save_exec_result function
    const msg = {
        "SaveResultMsg": {
            "project_id": projId,
            "user": request.user,
            "request": request.input,
            "req_id": request.req_id,
            "result": result
        },
    };

    // Execute the contract with the constructed message
    const executeResult = await client.execute(
        senderAddress,
        contractAddress,
        msg,
        executeFee
    );

    return executeResult ? executeResult : null;
}

// Call the bot function
bot().catch(console.error);
