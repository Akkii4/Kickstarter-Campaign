const path=require('path');
const solc=require('solc');
const fs=require('fs-extra');	//advance file system module

const buildPath=path.resolve(__dirname,'build');	//will return path of the build folder
fs.removeSync(buildPath);	//delete entire build folder on every run such that no previous file remains of last compile
const campaignPath=path.resolve(__dirname,'contracts','Kickstarter_Campaign.sol');	//path of contract file
const source=fs.readFileSync(campaignPath,'utf8'); //reading the file and defining its encoding
const output=solc.compile(source,1).contracts;	//compiling the file and also the no. of different contracts we want to compile in this case its 1
fs.ensureDirSync(buildPath);	//it ensures whether a directory(which is being passed ad argument) is present if not it will build auto
for(let contract in output){	//for in loop loops over only the key 
	fs.outputJsonSync(path.resolve(buildPath,contract.replace(":",'')+'.json'),output[contract]);
}	//this makes a json file in the buildPath whose value is received from the output[contract] every time it loops 