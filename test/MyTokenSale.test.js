const MyToken = artifacts.require("MyToken")
const MyTokenSale = artifacts.require("MyTokenSale")
const MyKycContract = artifacts.require("KycContract");

require('chai')
  .use(require('chai-as-promised'))
  .should()
  .assert
require('dotenv').config();


contract("TokenSale Test", async ([deployer,receiver]) => {
  let mytoken, totalSupply, mytokensale, mykyccontract

  before ( async() => { 
    //***NOTE: we run this test against the DEPLOYED versions of the contract
    // check the migration script for modifications to the state 
    mytoken = await MyToken.deployed()
    totalSupply = await mytoken.totalSupply()
    mytokensale = await MyTokenSale.deployed()
    mykyccontract = await MyKycContract.deployed()
  })

  describe('TokenSale Deployment', async () => { 
    it("should not have any tokens in deployer account", async () => {
      //check that the deployer has no more tokens (they were transfered in the migration script to the MyTokenSale contract)
      let deployer_token_balance = await mytoken.balanceOf(deployer)
      assert.equal(deployer_token_balance.toString(), "0")
    })

    it("should have all the tokens in the token sale contract", async() => {
      let tokensale_token_balance = await mytoken.balanceOf(mytokensale.address)
      assert.equal(tokensale_token_balance.toString(), totalSupply.toString())
    })

    it("should be possible to buy tokens", async () => {
      let qty = "1"
      await mykyccontract.setKycCompleted(receiver, {from: deployer})
      await mytokensale.sendTransaction({from: receiver, value: web3.utils.toWei(qty, "wei")})
      let receiver_token_balance = await mytoken.balanceOf(receiver)
      assert.equal(receiver_token_balance.toString(), "1")
    })

  })

})