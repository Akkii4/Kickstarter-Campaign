require('events').EventEmitter.defaultMaxListeners = 15;
const fs = require('fs');
const Web3=require('web3');
const compiledCampaignFactory=require('./build/CampaignFactory.json');

const web3=new Web3("http://localhost:8545");
let campaignFactoryContract;

const deploy=async()=>{
	const accounts=await web3.eth.getAccounts();
	console.log("Attempting to deploy from account: ",accounts[0]);
	campaignFactoryContract=await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
	.deploy({data:'0x'+compiledCampaignFactory.bytecode})
	.send({from:accounts[0],gas:'2000000'});
	console.log("Contract deployed to: ",campaignFactoryContract.options.address);
	fs.writeFileSync("contractaddress.txt",campaignFactoryContract.options.address)
};
deploy();
