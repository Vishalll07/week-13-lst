import { Connection, Keypair, PublicKey , sendAndConfirmTransaction , Transaction } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo , createBurnCheckedInstruction, createMintToCheckedInstruction, createTransferInstruction, } from "@solana/spl-token";

/**
 * Mints tokens on the Solana blockchain and transfers them to a recipient's token account.
 * @param {Connection} connection 
 * @param {Keypair} userKeypair 
 * @param {PublicKey} mintTokenAddress 
 * @param {PublicKey} receiverAddress 
 * @param {number} tokenAmount 
 */

export const mintTokens = async ( 
    connection: Connection, 
    userKeypair: Keypair, 
    mintTokenAddress: PublicKey, 
    receiverAddress: PublicKey, 
    tokenAmount: number) => {
        console.log("Starting the token minting process...");
        try {
            const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                userKeypair, 
                mintTokenAddress, 
                receiverAddress 
            );
    
            // Mint tokens to the recivers token account
            await mintTo(
                connection,
                userKeypair, 
                mintTokenAddress, 
                recipientTokenAccount.address, 
                userKeypair.publicKey, 
                tokenAmount 
            );     
            console.log(`Successfully minted ${tokenAmount} tokens to ${receiverAddress.toString()}`);
        } catch (error) {
            console.error("Error minting tokens:", error);
        }
    };

    
    
 

export const burnTokens = async (
  connection: Connection,
  userKeypair: Keypair,
  mintTokenAddress: PublicKey,
  burnAccountAddress: PublicKey,
  tokenAmount: number
) => {
  try {
    console.log("Initiating token burn...");

     const transaction = new Transaction().add(
      createBurnCheckedInstruction(
        burnAccountAddress, 
        mintTokenAddress,   
        userKeypair.publicKey, 
        tokenAmount * 1e9, 
        9 
      )
    );

 
    const txSignature = await sendAndConfirmTransaction(connection, transaction, [
      userKeypair
    ]);

    console.log("Tokens successfully burned. Transaction signature:", txSignature);
  } catch (error) {
    console.error("Error burning tokens:", error);
  }
};

export const sendNativeTokens = async (
    connection: Connection,
    payer: Keypair,
    receiverAddress: PublicKey,
    tokenAmount: number
) => {
    console.log("Sending native tokens...");

    try {
        const transaction = new Transaction().add(
            createTransferInstruction(
                payer.publicKey, 
                receiverAddress, 
                payer.publicKey,  
                tokenAmount * 1e9 
            )
        );

        
        const txSignature = await sendAndConfirmTransaction(connection, transaction, [
            payer,
        ]);

        console.log("Successfully sent SOL with transaction signature:", txSignature);
    } catch (error) {
        console.error("Error sending native tokens:", error);
    }
};