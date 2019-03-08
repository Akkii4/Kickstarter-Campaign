import web3 from './web3';
import campaignFactoryContract from './build/CampaignFactory.json';
export default new web3.eth.Contract
							( JSON.parse(campaignFactoryContract.interface),"0xDCE911ca552309e9cE249AEbF2E5395B385341e7");