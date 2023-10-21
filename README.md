![Logo](src/assets/ePocket%20with%20text.png)

# 8.-ePocket
A Smart Contract that will send payments to its owner in established amounts. It will display a calendar like this, accorrding to the Smart Contract:

![Sample calendar](src/assets/ePocket%20sample%20calendar.png)

and a button to claim money that will be active in the established dates.

# Installation
To install clone this repository, and install all dependencies by running `npm install`. 

After running the command `npx run dev`, which will set up a Vite server; head your browser to `http://127.0.0.1:5173/`   (the localhost address to this server) 

This will start a server configured to receive and send transactions to my personal ePocket. However, if you want to receive payments in your wallet, you should deploy and configure a new contract. This can be done by running the script: `scripts/deployWithDayAmounts.js` (specifying your wallet as the contract's owner and the amounts that you will claim for each day of the month). Then, fund your deployed ePocket with testether, by running: `scripts/fundWithEth.js`

Running the first script: `scripts/deployWithDayAmounts.js` will output the new contract's address to the screen. Place this address `src/app.tsx` on line 15 like his:
const ePocketAddress = '0x37c45b77f7456affe79432D4a64dcCC752667Fbb';  // <-- Put your ePocket address here

That is it, now the calendar will show data on this new deployed ePocket.

I hope you like it, much is left for further development, like a withdrawAll() method to retrieve all money to the owner, in case needed. Thanks.
