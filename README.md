# Kickstarter-Campaign
A replica of Kickstarter on Ethereum Blockchain.

A user can start his own campaign by creating new campaign and deciding upon a minimum ether contribution for his project from contributors.

Contributor of the project also becomes the approvers for that project by which they could vote for the request generated by the owner of the project as to how the contributed money should be spent.And the majority of the voters will decide whether the request is viable or not.

# Instructions
```
npm install
run ethereum node at localhost:8545
run npm run test (for testing of the contract)
in ethereum folder run node compile.js
run node deploy.js
copy address of the deployed contract from the contractaddress.txt to campaignFactory.js
now run npm run dev at see at localhost:3001
connect to metamask on localhost:8545
```
