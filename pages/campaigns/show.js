import React, { Component } from 'react';
import Layout from '../../components/Layout';
import campaignContract from '../../ethereum/campaign';
import { Card,Form,Input,Button,Grid,Message } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import {Link} from '../../routes';

class CampaignShow extends Component {
	static async getInitialProps(props) 
	{
		const campaignaddress=campaignContract(props.query.address);
		const summary=await campaignaddress.methods.getSummary().call();
		return{
			AddressCampaign:props.query.address,
			MinimumContribution:summary[0],
            Balance:summary[1],
            TotalRequests:summary[2],
            ApproversCount:summary[3],
            Manager:summary[4]
		};
	}
	state={amountToContribute:" ",       
       	   errormessage:"",
       	   loading:false};
	onSubmit=async event=>{ 
	   event.preventDefault(); 
	   this.setState({loading:true,errormessage:""});
	   try{
	  	const accounts=await web3.eth.getAccounts(); 
	  	await campaignContract(this.props.AddressCampaign).methods.contribute().send({
	  		from:accounts[0],value:web3.utils.toWei(this.state.amountToContribute,'ether')
	  	});
	  		Router.replaceRoute(`/campaigns/${this.props.AddressCampaign}`);
	  	}
	  	catch(err)
	  	{
	  		this.setState({errormessage:err.message});
	  	}
	  	this.setState({loading:false});
   	};
	renderCards(){
		const{
			MinimumContribution,
            Balance,
            TotalRequests,
            ApproversCount,
            Manager
		}=this.props;
		const items = [
			  {
			    header: Manager,
			    description: 'Manager is the one who created this campaign and can create request to withdraw money',
			    meta: 'Address of Manager',
			    style:{overflowWrap:'break-word'}
			  },
			  {
			    header: web3.utils.fromWei(MinimumContribution,'ether'),
			    description: 'You must contribute at least this much ether to become approver(contributor) of this campaign',
			    meta: 'Minimum amount of contribution in (ether)'
			  },
			  {
			    header: TotalRequests,
			    description: 'Request to withdraw some ether from this campaign and it must be approved by approvers',
			    meta: 'Number of request'
			  },
			  {
			    header: ApproversCount,
			    description: 'Number of people who successfully donated to this campaign',
			    meta: 'Number of Approvers'
			  },
			  {
			    header: web3.utils.fromWei(Balance,'ether'),
			    description: 'Amount of balance left in this campaigns to spend',
			    meta: 'Campaign Balance (ether)'
			  }
		];
		return <Card.Group items={items} />;
	}
	renderContributeForm()
	{	
	return(	
	<Form onSubmit={this.onSubmit} error={!!this.state.errormessage}>
		<Form.Field>
			<label>Amount to Contribute</label>
			<Input label='ether' labelPosition='right'
			onChange={event=>this.setState({amountToContribute:event.target.value})}/>
		</Form.Field>
		<Button primary loading={this.state.loading} type='submit'>Contribute</Button>
		<Message error header='Something went wrong' content={this.state.errormessage}/>
	</Form>
	);
	}
	render(){
		return (
			<Layout>
				<h3>Campaigns</h3>
				<Grid>
					<Grid.Row>
	    				<Grid.Column width={10}>
	     				 	{this.renderCards()}
	   					 </Grid.Column>
	    				<Grid.Column width={6}>
	     				 	{this.renderContributeForm()}
	   					 </Grid.Column>
	   				</Grid.Row>
	   				<Grid.Row>
	   					<Grid.Column>
		   					<Link route={`/campaigns/${this.props.AddressCampaign}/requests`}>
		    					<a><Button primary>View Requests</Button></a>
		    				</Link>
	    				</Grid.Column>
	   				</Grid.Row>
   				</Grid>
			</Layout>
			);
	}
}
export default CampaignShow;