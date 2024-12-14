import fs from 'fs';
import {
    NODE_URL,
    TRANSACTION_HASH,
} from './env.js';

const result = await fetch(
    new URL(`/transactions/confirmed/${TRANSACTION_HASH}`, NODE_URL),
)
    .then((res) => res.json());

const aggregateTransaction = result.transaction;
const innerTransaction = aggregateTransaction.transactions;

const allText = innerTransaction
    .map(({ meta, transaction }) => {
        const message = transaction.message;
        const buffer = Buffer.from(message.slice(2), 'hex');
        return buffer.toString('utf8');
    })
    .join('');

const all = JSON.parse(allText);

const publicJson = all['public.json'];
const proofJson = all['proof.json'];
const verificationKeyJson = all['verification_key.json'];

fs.writeFileSync('./public.json', JSON.stringify(publicJson, null, 2));
fs.writeFileSync('./proof.json', JSON.stringify(proofJson, null, 2));
fs.writeFileSync('./verification_key.json', JSON.stringify(verificationKeyJson, null, 2));
