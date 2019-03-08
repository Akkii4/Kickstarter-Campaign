const routes=require('next-routes')();
routes
.add('/campaigns/new','/campaigns/new') 
.add('/campaigns/:address','/campaigns/show')
.add('/campaigns/:address/requests','/campaigns/request/index')
.add('/campaigns/:address/requests/new','/campaigns/request/new');
module.exports=routes;