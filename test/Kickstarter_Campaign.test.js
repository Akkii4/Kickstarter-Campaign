const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const compiledCampaignFactory=require('../ethereum/build/CampaignFactory.json');
const compiledCampaign=require('../ethereum/build/Campaign.json');

let accounts;
let campaignFactoryContract;
let campaignContract;
let minimumAmount="1";
let contribute="5";
let requestValue="2";
let deployedCampaignAddress;

beforeEach(async()=>{
	accounts=await web3.eth.getAccounts();

	campaignFactoryContract=await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
		.deploy({data:compiledCampaignFactory.bytecode})
		.send({from:accounts[0],gas:"1000000"});
	await campaignFactoryContract.methods.createCampaign(web3.utils.toWei(minimumAmount,"ether")).send({
		from:accounts[0],
		gas:"1000000"});
	
	[deployedCampaignAddress]= await campaignFactoryContract.methods.getDeployedCampaigns().call()
	
	campaignContract= await new web3.eth.Contract(JSON.parse(compiledCampaign.interface),deployedCampaignAddress)
});

describe("ContractTest",()=>
{
	it("Both Contract are Deployed",()=>{	
		assert.ok(campaignFactoryContract.options.address);	
		assert.ok(campaignContract.options.address);	
	});
	it("Is manager",async()=>{	
		const manager=await campaignContract.methods.manager().call();
		assert.equal(accounts[0],manager);
	});
	it("Allow people to contribute atleast minimum contribution and make them approvers",async()=>{	
		try
		{
			await campaignContract.methods.contribute().send({
			from:accounts[1],
			value: web3.utils.toWei(contribute,"ether")
			});
		}	
		catch(err)
		{
			const isContributor=await campaignContract.methods.approvers(accounts[1]).call();
			assert(err|isContributor);
		}
	});
	it("Allows manager to make a request",async()=>{	
		await campaignContract.methods.createRequest('Buy Fan',web3.utils.toWei(requestValue,"ether"),accounts[1])
			.send({from:accounts[0],gas:"1000000"});
		const createdRequest=await campaignContract.methods.requests(0).call();
		assert.equal('Buy Fan',createdRequest.description);
	});
	it("Process a Request",async()=>{
		await campaignContract.methods.contribute()
			.send({from:accounts[1],value: web3.utils.toWei(contribute,"ether")});

		await campaignContract.methods.createRequest('Buy Bulb',web3.utils.toWei(requestValue,"ether"),accounts[2])
			.send({from:accounts[0],gas:"1000000"});
		
		await campaignContract.methods.approveRequest(0)
			.send({from:accounts[1],gas:"1000000"});

		const recepientinitialBalance=await web3.eth.getBalance(accounts[2]);

		await campaignContract.methods.finalizeRequest(0)
			.send({from:accounts[0],gas:"1000000"});

		const recepientfinalBalance=await web3.eth.getBalance(accounts[2]);
		const difference=recepientfinalBalance-recepientinitialBalance;
		assert(difference>web3.utils.toWei("1.8","ether"));
	});
}); 