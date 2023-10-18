const ethers = require('ethers');
require('dotenv').config();


/***************************
  Script that ends 27 Eth to ePocket deployed locally

 ***************************/
async function main() {

  //hardcoded to sepolia, but works
  //const url = process.env.LOCALHOST_URL;
  //const privateKey = process.env.LOCALHOST_ACCOUNT0_PRIVATE_KEY;
  const url = process.env.ALCHEMY_SEPOLIA_URL;
  const privateKey = process.env.APEX_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(privateKey, provider);
  const deployedToSepolia = "0x22A72641a44dEdF9b7F1Da2AC58ba16F5c5b6b7F";

  let tx = {
    to: deployedToSepolia,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther('0.7')
  }
  // Send a transaction
  await wallet.sendTransaction(tx)
  .then((txObj) => { 
    console.log('Sent 0.7testEth to', deployedToSepolia);
    console.log('txHash', txObj.hash) 
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});
