pragma solidity ^0.4.23;

contract CampaignFactory{
    address[] public deployedCampaigns; //address of all campaign ever deployed
    function createCampaign(uint minimumAmount) public{   //deploys new instance of Campaign by passing the minimumAmount as it is being reqd during Campaign constructor function and stores in address
        address newCampaign=new Campaign(minimumAmount,msg.sender); //creating instance and storing the address where the instance of Campaign contract is deployed in the newCampaign
        deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;  //returns address of the blockchain where the contract is deployed
    }
}

contract Campaign{
    struct Request{     //kind of objects for a Request of funds transfer to a third party initiated by manager
        string description; //for description i.e for what purpose request should be needed
        uint value; //amount required to send to a vendor
        address recepient;  //address of the vendor of whom we are sending it to
        bool complete;  //true or false based on the completion of request
        uint approvalCount; //store no. of yes votes by different approvers for manager's Request
        mapping(address=>bool)approvals;    //mapping of all approvers who have approved/voted to the request
    }
    Request[] public requests;  //creating a variable requests of type array which will hold value in format that of Request 
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool)public approvers; //address of all contributors 
    uint public approversCount;
    
    constructor(uint minimumAmount,address creator) public
    {
        manager=creator;       //setting manager to be equal to the address of the creator of the campaign instance by the CampaignFactory
        minimumContribution=minimumAmount;  //manager will set the minimumAmount at time of deploying contract & that will become the minimumContribution
    }
    
    function contribute() public payable
    {
        require(msg.value>minimumContribution); //value for contribution should be greater than minimumContribution
        approvers[msg.sender]=true; //setting true against the suucessfull contributors address in approvers map  
        approversCount++;    //it keeps the no. of approvers
    }

    modifier restricted()
    {
        require(msg.sender==manager);
        _;
    }
    
    function createRequest(string description,uint value,address recepient) public restricted
    {
        Request memory newRequest=Request({     //creating a variable newRequest which will hold value in format that of Request 
            description:description,
            value:value,
            recepient:recepient,        //setting the value of keys as being passed by manager during the function call
            complete:false,
            approvalCount:0
        });
        requests.push(newRequest);  //stacking up every request ever made to requests variable
    }
    
    function approveRequest(uint index) public{ //for voting/approving the request
        Request storage request=requests[index];    //making a variable request
        require(approvers[msg.sender]); //for voting on a request a person sholud be an approver/contributor to the campaign
        require(!request.approvals[msg.sender]);    //approver cant vote twice for a particular request  as there could be many request thus use requests[index] 
        request.approvals[msg.sender]=true; //true is set against the approver who voted and thus cant vote twice for the same request
        request.approvalCount++;    //a vote is added to the counter for that particular request
    }
    
    function finalizeRequest(uint index) public restricted
    {   
        Request storage request=requests[index];
        require(!request.complete); //to check that the request has not been finalized yet 
        require(request.approvalCount>(approversCount/2));    //approvalCount should more than 50% of the whole approversCount
        request.recepient.transfer(requests[index].value);  //as the request is approved by majority the funds mentioned in the request is transfered to the recepient mentioned in the request
        request.complete=true;  //setting complete status to be true so it cant be accessed again
    }

    function getSummary() public view returns(uint,uint,uint,uint,address){    //it collectively return some variables which wouuld be required during the front end app
        return(
            minimumContribution,
            this.balance,   //total contribution to a particular campaign
            requests.length,
            approversCount,
            manager //address of the campaign creator
            );
    }

    function getRequestsCount() public view returns(uint){    //it collectively return some variables which wouuld be required during the front end app
        return requests.length;
    }
}