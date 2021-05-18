const { assert } = require('chai');

const MyToken = artifacts.require("MyToken")
const MyTokenSale = artifacts.require("MyTokenSale")

require('chai')
  .use(require('chai-as-promised'))
  .should()
  .assert
require('dotenv').config();


//***NOTE: we run this test against the deployed versions of the contract
contract("TokenSale Test", async ([deployer,receiver]) => {
  let mytoken

  before ( async() => { 
    mytoken = await MyToken.deployed()
  })

  describe('TokenSale Deployment', async () => { 
    it("should not have any tokens in deployer account", async () => {
      //check that the deployer has no more tokens
      let deployer_tokens = await mytoken.balanceOf(deployer)
      assert.equal(deployer_tokens.toString(), "0")
    })

  })

})