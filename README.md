![Logo](src/assets/ePocket%20with%20text.png)

# 8.-ePocket
A Smart Contract that will send payments to its owner in established amounts. It will display a calendar like this, with your own configuration:

![Sample calendar](src/assets/ePocket%20sample%20calendar.png)

and a button to claim money that will be active in the established dates.

# Installation
To install clone this repository, and get all dependencies by running `npm install`. 

After running the command `npx run dev`, which will set up a Vite server; head your browser to `http://127.0.0.1:5173/`   (the localhost address to this server) 

This will start a server configured to receive and send transactions to my personal ePocket. To receive payments to your wallet, you should deploy and configure a new contract by running the script: `scripts/deployWithDayAmounts.js` (specifying your wallet as the contract's owner and the amounts that you will claim for each day of the month). Then, fund your deployed ePocket with testEther, by sending ether to the smart contract's address (using a wallet like Metamask), or by running this script if wallet is not available: `scripts/fundWithEth.js`

Running the above script: `scripts/deployWithDayAmounts.js` will output the new contract's address. Place this address on `src/app.tsx` at line 15 like this:
```javascript 
const ePocketAddress = '0x37c45b77f7456affe79432D4a64dcCC752667Fbb';  // <-- Put your ePocket address here
```

That is it, now the calendar will show data about this new deployed ePocket.

Much is left for further development: e.g. a withdrawAll() method to retrieve all money, in case needed. I hope you like it, thanks.
