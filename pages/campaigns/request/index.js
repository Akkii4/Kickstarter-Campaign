import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button,Table } from 'semantic-ui-react';
import {Link} from '../../../routes';
import CampaignContract from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
	static async getInitialProps(props) 
	{	
		const requestsCount=await CampaignContract(props.query.address).methods.getRequestsCount().call();
		const approversCount=await CampaignContract(props.query.address).methods.approversCount().call();
		const requests=await Promise.all(
			Array(parseInt(requestsCount)).fill().map((element,index)=>{
				return CampaignContract(props.query.address).methods.requests(index).call()
			}));

		return {campaignaddress:props.query.address,
				requests,
				approversCount,
				requestsCount};

	}
	renderRows(){
		return this.props.requests.map((request,index)=>{

		return (	
				<RequestRow
					key={index}
					id={index}
				    request={request}
				    campaignaddress={this.props.campaignaddress}
				    approversCount={this.props.approversCount}
				  />
				);
				});
			}

	render(){
		return(
			<Layout>
				<h3>Requests</h3>
				<Link route={`/campaigns/${this.props.campaignaddress}/requests/new`}>
					<a>
						<Button primary floated='right' style={{marginBottom:10}}>Add Request</Button>
					</a>
				</Link>
				 <Table>
				    <Table.Header>
				      <Table.Row>
				        <Table.HeaderCell>ID</Table.HeaderCell>
				        <Table.HeaderCell>Description</Table.HeaderCell>
				        <Table.HeaderCell>Amount</Table.HeaderCell>
				        <Table.HeaderCell>Recipient</Table.HeaderCell>
				        <Table.HeaderCell>Approval Count</Table.HeaderCell>
				        <Table.HeaderCell>Approve</Table.HeaderCell>
				        <Table.HeaderCell>Finalize</Table.HeaderCell>
				      </Table.Row>
				    </Table.Header>
				    <Table.Body>
				 	{this.renderRows()}
				 	</Table.Body>
				</Table>
				<div>Found {this.props.requestsCount} requests.</div>
			</Layout>
			);
	}
}
export default RequestIndex;