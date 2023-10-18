import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('YOUR_ETHEREUM_NODE_URL'); // Replace with your Ethereum node URL

/*********************************************************************************************************
ePocket SmartContract address: change it to claim from another contract, sending money to another wallet */
const ePocketAddress = '0x527e127BcA88e133512798217efC505007D47Cad';


export function BlockchainLoader() {
    const [loading, setLoading] = useState(true);
    const [blockchainData, setBlockchainData] = useState<string | null>(null);

    // Function to interact with the blockchain
    const fetchDataFromBlockchain = async () => {
        try {
            //const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
            const contractABI = ['YOUR_CONTRACT_ABI']; // Replace with your contract ABI

            const contract = new ethers.Contract(ePocketAddress, contractABI, provider);

            // Call a function from your contract
            const result = await contract.someFunction();

            setBlockchainData(result.toString());
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data from the blockchain:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataFromBlockchain();
    }, []);

    return (
        <div>
            {loading ? (
                <div className="spinner-container">
                    <ClipLoader size={50} color={'#123abc'} loading={loading} />
                    <p>Loading from the blockchain...</p>
                </div>
            ) : (
                <div className="content">
                    <p>Blockchain data loaded: {blockchainData}</p>
                </div>
            )}
        </div>
    );
}

