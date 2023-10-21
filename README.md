![logo](src/assets/ePocket%20with%20text.png)

# 8.-ePocket
A smart contract that will send payments to its owner in established amounts

# Installation
To install clone this repository, and run the command `npx run dev` which will set up a Vite server. Then head your browser to http://127.0.0.1:5173/   which is the localhost address to this server. 

This will start a webapp server configured to receive and send transactions to my personal ePocket (which will send money to my test wallet). However, if you want to receive payments in yout wallet, you should deploy and configure a new contract. This can be done by running the script: `scripts/deployWithDayAmount.js` (specifying your wallet as the contract's owner and the amounts that you will claim for each day of the month). Then, fund your deployed ePocket with testether, by running: `scripts/fundWithEth.js`

Running the first script: `scripts/deployWithDayAmount.js` will output the new contract's address to the screen, copy and paste it in src/app.tsx on line XXXXXXXXXXXXXXXXXXXX
AQUI ME QUEDE, TERMINANDO DE DOCUMENTAR, EL VIDEO YA ESTA, SOLO SUBIR A GITHUB CON INDICACIONES E IMAGENES, 
That is it, thanks for reading, see you around
 the app will run displaying with your ePocket contract, sending money to its owner, according to your establishedAmounts.
follow he instructions.
However, this will start a webapp configured to read for my personal ePocket, which will send payments to my own test wallet. In order to set up your own ePocket, you should deploy a new contract. This can be done by running the script:`scripts/deploy` (configuring your wallet as the owner and the amounts that you want to claim for each day). Then fund your deployed ePocket with testether: `scripts/fundwithEther.js'

The scripts/deploy.js will output the new contracts address, that should be pasted in src/app.tsx on line

That is it, thanks for reading, see you around
 the app will run displaying with your ePocket contract, sending money to its owner, according to your establishedAmounts.
