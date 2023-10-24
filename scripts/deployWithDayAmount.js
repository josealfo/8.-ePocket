const ethers = require('ethers');
require('dotenv').config();

/* Script to deploy an ePocket Smart Contract with an array dayAmounts and no initial deposit.
 * The owner will be the address who deployed. 
 *
 * We first create an arrayOfAmounts (in wei) that indicate the amount the owner can claim for a particular day. 0 indexed, so on 1st day of the month,
 * the amount to claim will be arrayOFAmounts[0], for day 2 arrayOFAmounts[1] and so on until day 31 corresponding to arrayOfAmounts[30]. If a month has less than
 * 31 days, e.g. February, still the array will be filled, even when that day will not be accesible (never will be feb 31 to claim that amount).
 * 
 * For testing purposes, the contract being deployed will be set up to clam 0.01 eth on day 1, 0.02 on day two and so on (0 if the day is a primer number, see code
 * below)... Change these amounts according to your needs.
 * 
 * At the end, this script will display the array of amounts being registered, and the address where it was deployed to
 */ 
async function main() {
  const url = process.env.ALCHEMY_SEPOLIA_URL;
  const privateKey = process.env.APEX_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(privateKey, provider);

  let arrayOfAmounts = [];
  for(let i =0; i<31; i++) {
      if(i<9) {
        arrayOfAmounts[i] = ethers.utils.parseEther('0.0' + String(i+1));
      } else {
        arrayOfAmounts[i] = ethers.utils.parseEther('0.' + String(i+1));
      }
  }

  // resetting to 0 on prime number days: 1 2 3 5 7 11 13 17 19 23 29 31 (0 index)// resetting to 0 on prime number days: 1 2 3 5 7 11 13 17 19 23 29 31 (0 index)// resetting to 0 on prime number days: 1 2 3 5 7 11 13 17 19 23 29 31 (0 index)// resetting to 0 on prime number days: 1 2 3 5 7 11 13 17 19 23 29 31 (0 index)
  arrayOfAmounts[0] = arrayOfAmounts[1] = arrayOfAmounts[2] = arrayOfAmounts[4] = arrayOfAmounts[6] = arrayOfAmounts[10] = arrayOfAmounts[12] = arrayOfAmounts[16] = arrayOfAmounts[18] = arrayOfAmounts[22] = arrayOfAmounts[28] = arrayOfAmounts[30] = ethers.utils.parseEther('0');

  console.log('  Creating a Contract wih the following establishedAmounts');
  console.log('==================================================================');
  for(let i =0; i<31; i++) {
      console.log(arrayOfAmounts[i].toString() + '(' + ethers.utils.formatEther(arrayOfAmounts[i]) + 'Eth for day #' + (i + 1) + ')');
  }

  let artifacts = await hre.artifacts.readArtifact("ePocket");
  // Create an instance of a Faucet Factory
  let ePocketFactory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);
  let ePocketContract = await ePocketFactory.deploy(arrayOfAmounts);
  await ePocketContract.deployed();

  console.log("ePocketContract deployed to address:", ePocketContract.address);
  console.log(" will be sending to owner:", await ePocketContract.owner());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

/* Run locally from another proyect 
   (8.-ePocket3, because I doubt to have hre installed), with the following output:

      then deployed to address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
     sending to beneficiary: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

  Oct 9: Deployed on sepolia with a days array

  Oct 14: Deployed on sepolia with the following output
  [
0(0.0Eth for day #1)
0(0.0Eth for day #2)
0(0.0Eth for day #3)
40000000000000000(0.04Eth for day #4)
0(0.0Eth for day #5)
60000000000000000(0.06Eth for day #6)
0(0.0Eth for day #7)
80000000000000000(0.08Eth for day #8)
90000000000000000(0.09Eth for day #9)
100000000000000000(0.1Eth for day #10)
0(0.0Eth for day #11)
120000000000000000(0.12Eth for day #12)
0(0.0Eth for day #13)
140000000000000000(0.14Eth for day #14)
150000000000000000(0.15Eth for day #15)
160000000000000000(0.16Eth for day #16)
0(0.0Eth for day #17)
180000000000000000(0.18Eth for day #18)
0(0.0Eth for day #19)
200000000000000000(0.2Eth for day #20)
210000000000000000(0.21Eth for day #21)
220000000000000000(0.22Eth for day #22)
0(0.0Eth for day #23)
240000000000000000(0.24Eth for day #24)
250000000000000000(0.25Eth for day #25)
260000000000000000(0.26Eth for day #26)
270000000000000000(0.27Eth for day #27)
280000000000000000(0.28Eth for day #28)
0(0.0Eth for day #29)
300000000000000000(0.3Eth for day #30)
0(0.0Eth for day #31)
]
ePocketContract deployed to address (with the above establishedAmounts): 0x37c45b77f7456affe79432D4a64dcCC752667Fbb
 sending to owner: 0x12ff0e981701eA0747058C64936224B8deFCe185

*/
