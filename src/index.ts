require('dotenv').config();
import express from 'express';
import { burnTokens, mintTokens, sendNativeTokens } from './mintTokens';
import { Connection, Keypair, PublicKey , sendAndConfirmTransaction , Transaction } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo , createBurnCheckedInstruction, createMintToCheckedInstruction, createTransferInstruction, } from "@solana/spl-token";

const app = express();


app.post('/helius', async (req, res) => {
    const connection = new Connection('https://api.devnet-beta.solana.com'); 
    const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(req.body.payerSecretKey))); 
    const mintTokenAddress = new PublicKey(req.body.mintTokenAddress);
    const receiverAddress = new PublicKey(req.body.toAddress);
    const tokenAmount = req.body.amount; 
    const type = req.body.type || "received_native_sol";

    try {
        if (type === "received_native_sol") {
            await mintTokens(connection, payer, mintTokenAddress, receiverAddress, tokenAmount);
        } else {
            await burnTokens(connection, payer, mintTokenAddress, receiverAddress, tokenAmount);
            await sendNativeTokens(connection, payer, receiverAddress, tokenAmount);
        }
        res.send('Transaction successful');
    } catch (error) {
        console.error("Transaction failed:", error);
        res.status(500).send('Transaction failed: ');
    }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});