import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button,Form,Input,Message } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import deployedCampaignFactory	from '../../ethereum/campaignFactory';
import {Router} from "../../routes";

class CampaignNew extends Component{
	state={minimumcontribution:" ",       //setting all the parameters to default value
       	   errormessage:"",
       	   loading:false};
	onSubmit=async event=>{ 
	   event.preventDefault(); //prevents auto submission of form 
	   this.setState({loading:true,errormessage:""});
	   try{
	  	const accounts=await web3.eth.getAccounts(); 
	  	await deployedCampaignFactory.methods
	  		.createCampaign(web3.utils.toWei(this.state.minimumcontribution,'ether'))
	  		.send({from:accounts[0]});
	  		Router.pushRoute('/');
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
				<h3>Create a Campaign</h3>
				<Form onSubmit={this.onSubmit} error={!!this.state.errormessage}>
    				<Form.Field>
				      <label>Minimum Contribution</label>
				       <Input label='ether' labelPosition='right' 
				       	onChange={event=>this.setState({minimumcontribution:event.target.value})}
				       	/>
   					</Form.Field>
   					<Button primary loading={this.state.loading} type='submit'>Create</Button>
				    <Message error header='Something went wrong' content={this.state.errormessage}/>
 				</Form>
			</Layout>
		);
	}
}
export default	CampaignNew;