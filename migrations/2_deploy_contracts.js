const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");
require('dotenv').config();

//accounts is the web3 accounts (no need to call it)
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);//deploy token with initial supply minted to the msg.sender (accounts[0])
  //We need to then transfer all the tokens from msg.sender to the MyTokenSale contract
  await deployer.deploy(MyTokenSale, 1, accounts[0], MyToken.address);//deploy token sale
  //grab the deployed token
  const mytoken = await MyToken.deployed();
  //transfer from the owner to the tokensale address
  await mytoken.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS);
};
