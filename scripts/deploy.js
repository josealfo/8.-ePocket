const ethers = require('ethers');
require('dotenv').config();

async function main() {

  // hardcoded network, but anyway
  //const url = process.env.LOCALHOST_URL;
  //const privateKey = process.env.LOCALHOST_ACCOUNT0_PRIVATE_KEY;
  const url = process.env.ALCHEMY_SEPOLIA_URL;
  const privateKey = process.env.APEX_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(privateKey, provider);
  const acc0Address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  let arrayOfAmounts = [];
  for(let i =0; i<31; i++) {
    arrayOfAmounts[i] = ethers.utils.parseEther('0');
  }

  arrayOfAmounts[0] = arrayOfAmounts[14] = ethers.utils.parseEther('0.07');
  arrayOfAmounts[6] = arrayOfAmounts[20] = ethers.utils.parseEther('0.05');

  let artifacts = await hre.artifacts.readArtifact("ePocket");
  // Create an instance of a Faucet Factory
  let ePocketFactory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);
  let ePocketContract = await ePocketFactory.deploy(arrayOfAmounts);
  await ePocketContract.deployed();

  console.log("ePocketContract deployed to address:", ePocketContract.address);
  console.log(" sending to owner:", await ePocketContract.owner());
}

/* Run locally from another proyect 
   (8.-ePocket3, because I doubt to have hre installed), with the following output:

  ePocketContract deployed to address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
 sending to beneficiary: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

   2) second deployment
   ePocketContract deployed to address: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9


  Sept 1, deployed to sepolia with the following output:
  ePocketContract deployed to address: 0x22A72641a44dEdF9b7F1Da2AC58ba16F5c5b6b7F
 sending to owner: 0x12ff0e981701eA0747058C64936224B8deFCe185


*/


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});
