const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");

module.exports = function(deployer) {

  let accounts = await web3.eth.getAccounts(); //grab accounts to use for deployment
  deployer.deploy(MyToken,1000000);//deploy token with initial supply minted to the msg.sender (accounts[0])
  //We need to then transfer all the tokens from msg.sender to the MyTokenSale contract
  deployer.deploy(MyTokenSale, 1, accounts[0], MyToken.address);//deploy token sale
  const mytoken = await MyToken.deployed();
  await mytoken.transfer(MyTokenSale.address, 1000000);

};
