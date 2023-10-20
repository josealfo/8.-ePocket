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


// Connection to Ethereum
const APEX_PRIVATE_KEY = '0x5a574047a789fdc82091c649346c711cf539417d966e2dce501362dd77bf6e18';
const url = 'https://eth-sepolia.g.alchemy.com/v2/VAwg_ZetOtVJwNdOvLMR2cY20G6LW8Yj';
const provider = new JsonRpcProvider(url);
const wallet = new ethers.Wallet(APEX_PRIVATE_KEY, provider);
const abi = EPocketABI;
const ePocketContract = new ethers.Contract(ePocketAddress, abi, wallet);

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
  const [balance, setBalance] = useState<number | null>(null);   // coment this line
  const [establishedAmounts, setEstablishedAmouns] = useState<number[] | null>(null); //also comment
  const [lastClaim, setLastClaim] = useState<number>(0);

  /* When click the claim button will execute a transaction and get the receipt */
  async function handleClaimClick() {
    setLoading(true);
    const txResponse = await ePocketContract.claim();
    const receipt = await txResponse.wait();
    setLoading(false);
    alert('Claimed! tx: ' + receipt.hash);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const epData = await ePocketContract.getData();
        setEthData(epData);
        // comment this lines
        const bal = await ePocketContract.getBalance();
        setBalance(bal);
        const establishedAmounts = await ePocketContract.establishedAmounts();
        setEstablishedAmouns(establishedAmounts);
        //const lastClaim = await ePocketContract.lastClaim();
        const lastClaim = epData.lastClaim();
        setLastClaim(lastClaim);
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

  // Convert the lastClaim timestamp to a Date object
//  const lastClaimDate = new Date(lastClaim);  // change to ethData.lastClaim
  // Convert the lastClaim timestamp to a Date object from ethData.lastClaim (casting it to a Number)
  const lastClaimDate = ethData ? new Date(Number(ethData.lastClaim)) : new Date(0);


  // Compare the year, month, and day
  const alreadyClaimedToday = (
    currentDate.getFullYear() === lastClaimDate.getFullYear() &&
    currentDate.getMonth() === lastClaimDate.getMonth() &&
    currentDate.getDate() === lastClaimDate.getDate()
  );

  if (alreadyClaimedToday) {
    console.log('The timestamp of lastClaim corresponds to the current day: already claimed today.');
  } else {
    console.log('The timestamp of lastClaim does not correspond to the current day: has not claimed today.');
  }

  /***************** Debug logs ***********/
  const debugTimestamp = new Date();  // Get the current timestamp and format it
  const formattedTimestamp = `${debugTimestamp.getHours().toString().padStart(2, '0')}:${debugTimestamp.getMinutes().toString().padStart(2, '0')}:${debugTimestamp.getSeconds().toString().padStart(2, '0')}`;
  
  console.log(`${formattedTimestamp}: balance is ${balance ?? 'N/A'} (${formatEther(balance?.toString() ?? '0')} Eth)`);
  // move here to $ethData?.lastClaim
  console.log(`${formattedTimestamp}: establishedAmounts is ', ${establishedAmounts}`);
  console.log(`${formattedTimestamp}: lastClaim is ', ${lastClaim}`);
  console.log(`${formattedTimestamp}: ethData.balance is ${ethData?.balance}`);
  console.log(`${formattedTimestamp}: ethData.establishedAmounts is ', ${ethData?.establishedAmounts}`);
  console.log(`${formattedTimestamp}: ethData.lastClaim is ', ${ethData?.lastClaim} and lastClaimDate is ${lastClaimDate}`);
  console.log(`${formattedTimestamp}: ethData.lastClaim is ', ${ethData?.lastClaim}`)

  // Convert Wei to Ether
  const amountToClaimInWei: BigNumberish = ethData?.establishedAmounts[dayOfTheMonth - 1] ?? 0;

  // Conditionally render a claim button or a text based on the amount to claim (and the lastClaim) 
  let claimContent;
  if (alreadyClaimedToday) {
    claimContent = <p>You already claimed today :) Come back soon...</p>;
    console.log('The timestamp of lastClaim corresponds to the current day: already claimed today.');
  } else {
    console.log('The timestamp of lastClaim does not correspond to the current day: has not claimed today.');
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

  // Set the title and favicon
  document.title = 'ePocket';
  const faviconLink = document.createElement('link');
  faviconLink.rel = 'icon';
  faviconLink.type = 'image/png'; 
  faviconLink.href = '/ePocketFavicon.png'; // Use the correct path and file name

  // Append the favicon link to the head of the document
  document.head.appendChild(faviconLink);

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
                  
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;