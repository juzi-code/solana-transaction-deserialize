const bs58 = require('bs58');
const solanaWeb3 = require('@solana/web3.js');


async function signTransaction(callData, blockhash, privateKey) {

    // decode
    const transaction = bs58.decode(callData)

    let tx
    // There are two types of callData, one is the old version and the other is the new version.
    try {
        tx = solanaWeb3.Transaction.from(transaction)
    } catch (error) {
        tx = solanaWeb3.VersionedTransaction.deserialize(transaction)
    }

    if (tx instanceof solanaWeb3.VersionedTransaction) {
        tx.message.recentBlockhash = blockhash;
    } else {
        tx.recentBlockhash = blockhash
    }



    let feePayer = solanaWeb3.Keypair.fromSecretKey(bs58.decode(privateKey))
    // sign
    if (tx instanceof solanaWeb3.VersionedTransaction) {
    // v0 callData
        tx.sign([feePayer])
      } else {
    // legacy callData
        tx.partialSign(feePayer)
      }
    const txSerialize = tx.serialize();
    const txSerializeBase58 = bs58.encode(txSerialize);
    return txSerializeBase58;
}
module.exports = { signTransaction };