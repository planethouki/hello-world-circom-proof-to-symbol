import fs from 'fs';
import {
    PrivateKey,
} from 'symbol-sdk';
import {
    KeyPair,
    Network,
    SymbolFacade,
} from 'symbol-sdk/symbol'
import {
    NODE_URL,
    PRIVATE_KEY,
} from './env.js';

function splitStringByLength(str, length) {
    const result = [];
    for (let i = 0; i < str.length; i += length) {
        result.push(str.slice(i, i + length));
    }
    return result;
}

const all = JSON.parse(fs.readFileSync('./all.json', { encoding: 'utf-8' }));
const allText = JSON.stringify(all);
const messages = splitStringByLength(allText, 1023)
    .map((chunk) => {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(chunk);
        return new Uint8Array([0x00, ...encoded]);
    });

const network = Network.TESTNET
const facade = new SymbolFacade(network.name);
const deadline = facade.now().addHours(2).timestamp;

const privateKey = new PrivateKey(PRIVATE_KEY);
const keyPair = new KeyPair(privateKey);
const address = network.publicKeyToAddress(keyPair.publicKey);

const innerTransactions = messages
    .map((message) => {
        return facade.transactionFactory.createEmbedded({
            type: 'transfer_transaction_v1',
            signerPublicKey: keyPair.publicKey,
            recipientAddress: address,
            mosaics: [],
            message,
        });
    });

const transactionsHash = SymbolFacade.hashEmbeddedTransactions(innerTransactions)

const transaction = facade.transactionFactory.create({
    type: 'aggregate_complete_transaction_v2',
    signerPublicKey: keyPair.publicKey,
    fee: 1000000n,
    deadline,
    transactions: innerTransactions,
    transactionsHash,
});

const signature = facade.signTransaction(keyPair, transaction);
const jsonPayload = facade.transactionFactory.static.attachSignature(transaction, signature);
const hash = facade.hashTransaction(transaction).toString();

console.log(jsonPayload);
console.log(hash);

const sendRes = await fetch(
    new URL('/transactions', NODE_URL),
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: jsonPayload }
)
    .then((res) => res.json());
console.log(sendRes);

await new Promise((resolve) => setTimeout(resolve, 1000));

const statusRes = await fetch(new URL("/transactionStatus/" + hash, NODE_URL))
    .then((res) => res.json());
console.log(statusRes);