![logo](src/assets/ePocket with text.png)

# 8.-ePocket
A smart contract that will send payments to its owner in established amounts

# Installation
To install clone this repository, and run the command `npx run dev` which will set up a Vite server. Then head your browser to http://127.0.0.1:5173/   which is the localhost address to this server. 

this will start a webapp server configured to receive and send transactions to my ePocket, which will send payments to my personal test wallet. If you want to receive money in yout wallet, you should deploy a new contract and configure to which address send payments and its amounts. This can be done by running the script:`scripts/deployWithDayAmount.js` (configuring your wallet as the owner and the amounts that you want to claim for each day). Then fund your deployed ePocket with testether: by running: `scripts/fundWithEth.js'

Running `scripts/deployWithDayAmount.js` will output the new contract's address, that should be pasted in src/app.tsx on line
AQUI ME QUEDE, TERMINANDO DE DOCUMENTAR, EL VIDEO YA ESTA, SOLO SUBIR A GITHUB CON INDICACIONES E IMAGENES, ESTOY SUBIENDO LOS ARCHIVOS A GITHUB, VEREMOS SI SE SUBEN
That is it, thanks for reading, see you around
 the app will run displaying with your ePocket contract, sending money to its owner, according to your establishedAmounts.
follow he instructions.
However, this will start a webapp configured to read for my personal ePocket, which will send payments to my own test wallet. In order to set up your own ePocket, you should deploy a new contract. This can be done by running the script:`scripts/deploy` (configuring your wallet as the owner and the amounts that you want to claim for each day). Then fund your deployed ePocket with testether: `scripts/fundwithEther.js'

The scripts/deploy.js will output the new contracts address, that should be pasted in src/app.tsx on line

That is it, thanks for reading, see you around
 the app will run displaying with your ePocket contract, sending money to its owner, according to your establishedAmounts.
