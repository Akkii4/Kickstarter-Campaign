import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form,Message,Button,Input } from 'semantic-ui-react';
import campaignContract from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Router,Link} from '../../../routes';

class RequestNew extends Component {
	static async getInitialProps(props) 
	{
		return {campaignaddress:props.query.address}
	}
	state={value:"",
		   description:"",
		   recipient:"",       
       	   errormessage:"",
       	   loading:false};
	onSubmit=async event=>{ 
	   event.preventDefault(); 
	   this.setState({loading:true,errormessage:""});
	   try{
	  	const accounts=await web3.eth.getAccounts(); 
	  	await campaignContract(this.props.campaignaddress).methods.createRequest(this.state.description,web3.utils.toWei(this.state.value,'ether'),this.state.recipient).send({from:accounts[0]});
	  	Router.replaceRoute(`/campaigns/${this.props.campaignaddress}`);
	  	}
	  	catch(err)
	  	{
	  		this.setState({errormessage:err.message});
	  	}
	  	this.setState({loading:false});
   	};
	render(){
		return(
			<Layout>
				<h3>Create a Request</h3>
				<Form onSubmit={this.onSubmit} error={!!this.state.errormessage}>
					<Form.Field>
						<label>Description</label>
						<Input
						onChange={event=>this.setState({description:event.target.value})}/>
					</Form.Field>
					<Form.Field>
						<label>Amount in Ether</label>
						<Input label='ether' labelPosition='right'
						onChange={event=>this.setState({value:event.target.value})}/>
					</Form.Field>
					<Form.Field>
						<label>Recipient</label>
						<Input placeholder='Wallet Address' 
						onChange={event=>this.setState({recipient:event.target.value})}/>
					</Form.Field>
					<Button primary loading={this.state.loading} type='submit'>Create</Button>
					<Message error header='Something went wrong' content={this.state.errormessage}/>
				</Form>
			</Layout>
			);
	}
}
export default RequestNew;