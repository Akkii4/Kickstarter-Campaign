import React, { Component } from 'react';
import { Table,Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import CampaignContract from '../ethereum/campaign';
class RequestRow extends Component {
	onApprove=async()=>{
		const accounts=await web3.eth.getAccounts();
		const requestsCount=await CampaignContract(this.props.campaignaddress).methods.approveRequest(this.props.id).send({from:accounts[0]});
	};
	onFinalize=async()=>{
		const accounts=await web3.eth.getAccounts();
		const requestsCount=await CampaignContract(this.props.campaignaddress).methods.finalizeRequest(this.props.id).send({from:accounts[0]});
	};
render(){
	const readyToFinalize=this.props.request.approvalCount>this.props.approversCount/2;
		return(

				      <Table.Row disabled={this.props.request.complete} positive={readyToFinalize && !this.props.request.complete}>
				        <Table.Cell>{this.props.id}</Table.Cell>
				        <Table.Cell>{this.props.request.description}</Table.Cell>
				        <Table.Cell>{web3.utils.fromWei(this.props.request.value,'ether')}</Table.Cell>
				        <Table.Cell>{this.props.request.recepient}</Table.Cell>
				        <Table.Cell>{this.props.request.approvalCount}/{this.props.approversCount}</Table.Cell>
				        <Table.Cell>
					        {
					        	this.props.request.complete ? null :(
					        		<Button color="green" basic onClick={this.onApprove}>Approve</Button>
					        	)
					        }
				        </Table.Cell>
				        <Table.Cell>
				        	{
				        		this.props.request.complete ? null :(
				        			<Button  color="teal" basic onClick={this.onFinalize}>Finalize</Button>
				      			)
				      		}
				      	</Table.Cell>
				      </Table.Row>
				    );
	}
}
export default RequestRow;
			