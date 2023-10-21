import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { formatEther } from 'ethers';
import { BigNumberish } from 'ethers';
import { JsonRpcProvider } from 'ethers';
import ePocketLogo from './assets/ePocket with text.png';
import EPocketABI from './EPocketABI.json';
import { EPocketCalendar } from './EPocketCalendar';
import { PulseLoader } from "react-spinners";
import './App.css';


/* Modify this variable with your own ePocket address (has to be a deployed contract, scripts to deploy are provided in  scripts/ */
/* (Remember: to sendd ether, the Contract must have a balance > 0, and wallet address has to be the owner, the one who deployed) */
const ePocketAddress = '0x37c45b77f7456affe79432D4a64dcCC752667Fbb';  // <-- Put your ePocket address here

/** 
 * This is the main file of the typescript app. Shows 'ePocket' title and calls the Ethereum blockchain to fetch smart contract's data.
 *  This happens while the spinner is loading, and then the data is stored in 'ethData' state variable, when Ethereum returns, using Ethers.
 * 'ethData' will contain the array with the 'establishedAmounts' (with 18 digis hexadecimal). This 'establishedAmounts' will repeat for every
 * month, even when it has 30, 31, 28 or 29 days.
 * 
 * Using this 'establishedAmounts' array that we get from the Smart Contract through ethers, we render a react-calendar Calendar and fill
 * ir with the info, setting an event for every day of the month with the amount allowed to claim. As I said, these amounts will be in hexadecimal 
 * weis, so we use ethers to display values in eth.
 * 
 * Right now, this app is set up to read a sepolia Smart Contract heading to its owner, my wallet. If you want it to redirect it to your personal wallet,
 * you must deploy a new contract, and the deployer will be the new owner, receiving all payments. Then fund it with testEth (from a faucet) so that it has 
 * a positive balance. A script for doing these tasks are provided in 'scripts/deployWithDayAmounts.js' and 'fundWithEth.js'. Read the README.md for instructions
 * on how to download and install.
 */

// Solidity struct containing data about the smart contract, returned by it
interface BlockchainData {
  owner: string;
  balance: number;
  establishedAmounts: number[];
  lastClaim: number;
}

/* Main Component of the App, Will display the Title, Claim button, Calendar, and info (like owner address, balance, etc)*/
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [ethData, setEthData] = useState<BlockchainData | null>(null);

  // Connection to Ethereum
  // Using vite-plugin-env (instead of dotenv)
  const endpoint = import.meta.env.VITE_ENDPOINT_URL;
  const privateKey = import.meta.env.VITE_PRIVATE_KEY
  const provider = new JsonRpcProvider(endpoint);
  const wallet = new ethers.Wallet(privateKey, provider);
  const abi = EPocketABI;
  const ePocketContract = new ethers.Contract(ePocketAddress, abi, wallet);


  /* When click the claim button will execute a transaction and get the receipt */
  async function handleClaimClick() {
    setLoading(true);
    const txResponse = await ePocketContract.claim();
    const receipt = await txResponse.wait();
    setLoading(false);
    alert('Claimed! tx: ' + receipt.hash);
  }

  // fetch data from Etereum, and stop the spinner, after showing ePocket logo.
  useEffect(() => {
    async function fetchData() {
      try {
        // fetch smart contract's data from Ethereum and set it in a state object variable 
        const epData = await ePocketContract.getData();
        setEthData(epData);      
      } catch (error) {
        console.error("Error fetching data from Ethereum:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const currentDate = new Date();
  const dayOfTheMonth = currentDate.getDate();
  console.log(`--:--:--: dayOfTheMonth is ${dayOfTheMonth}`);

  // Convert the lastClaim timestamp to a Date object from ethData.lastClaim (casting it to a Number)
  const lastClaimDate = ethData ? new Date(Number(ethData.lastClaim)) : new Date(0);

  // Compare the year, month, and day of the lastClaim to see if it has already claimed for today
  const alreadyClaimedToday = (
    currentDate.getFullYear() === lastClaimDate.getFullYear() &&
    currentDate.getMonth() === lastClaimDate.getMonth() &&
    currentDate.getDate() === lastClaimDate.getDate()
  );

  /***************** Debug logs ***********/
  const debugTimestamp = new Date();  // Get the current timestamp and format it
  const formattedTimestamp = `${debugTimestamp.getHours().toString().padStart(2, '0')}:${debugTimestamp.getMinutes().toString().padStart(2, '0')}:${debugTimestamp.getSeconds().toString().padStart(2, '0')}`;
  console.log(`${formattedTimestamp}: ethData.balance is ${ethData?.balance}`);
  console.log(`${formattedTimestamp}: ethData.establishedAmounts is ', ${ethData?.establishedAmounts}`);
  console.log(`${formattedTimestamp}: ethData.lastClaim is ', ${ethData?.lastClaim} and lastClaimDate is ${lastClaimDate}`); 
  /***************** Debug logs ***********/

  // Conditionally render a claim button or a text based on the amount to claim (and the lastClaim) 
  let claimContent;
  const amountToClaimInWei: BigNumberish = ethData?.establishedAmounts[dayOfTheMonth - 1] ?? 0;
  if (alreadyClaimedToday) {
    claimContent = <p>You already claimed today :) Come back soon...</p>;
    console.log(`${formattedTimestamp}: The timestamp of ethData.lastClaim corresponds to the current day: already claimed today.`);
  } else {
    console.log(`${formattedTimestamp}: The timestamp of ethData.lastClaim does not correspond to the current day: has not claimed today.`);
    if (amountToClaimInWei > 0) {
      claimContent = (
        <button className="claim-button" onClick={() => handleClaimClick()}>
          Claim ${formatEther(amountToClaimInWei)} Eth
        </button>
      );
    } else {
      claimContent = <p>Nothing to claim today. </p>;
    }
  }

  // Set the title (favicon changed by altering the image 'public/favicon.svg')
  document.title = 'ePocket';

  return (
    <>
      <img src={ePocketLogo} className="logo" alt="ePocket logo" />
      <div>
        {loading ? (
          <div className="spinner-container">
            <PulseLoader size={30} color={"#72ec08"} loading={loading} />
          </div>
        ) : (
          <>
            <div className="card">
              {claimContent}
            </div>
            <div className='card'>
              <EPocketCalendar establishedAmounts={ethData?.establishedAmounts} />
            </div>
            <div>
              <table className="tabledata">
                  <tbody>
                    <tr>
                      <td className="cell-label">ePocket address:</td>
                      <td className='cell-data'>{ePocketAddress}</td>
                    </tr>
                    <tr>
                      <td className="cell-label">Transfering to:</td>
                      <td className='cell-data'>{ethData?.owner}</td>
                    </tr>
                    <tr>
                      <td className="cell-label">Balance:</td>
                      <td className='cell-data'>{formatEther(ethData?.balance ?? 0)} Eth</td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;