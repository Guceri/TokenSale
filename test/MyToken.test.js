const MyToken = artifacts.require("MyToken")
require('chai')
  .use(require('chai-as-promised'))
  .should()
  .assert
require('dotenv').config();
const EVM_REVERT = 'VM Exception while processing transaction: revert'

//web3 is automatically injected into truffle tests
contract("MyToken", async ([deployer,receiver]) => {
  let myToken, totalSupply, init_owner_balance

  //hook to run before the first 'describe' (will not renew state for each "it")
  before ( async() => {
    myToken = await MyToken.new(process.env.INITIAL_TOKENS)//creates a new instance 
    totalSupply = await myToken.totalSupply()
    init_owner_balance = await myToken.balanceOf(deployer)
  })

  describe('deployment', async () => {

    it("should transfer all tokens to deployer account", async () => {
      init_owner_balance.toString().should.equal(totalSupply.toString(), "full transfer of tokens to owner")
    })

    it("should be possible to send tokens between accounts", async() => {
      const qty = "1"
      await myToken.transfer(receiver, qty, {from: deployer})
      let receiver_balance = await myToken.balanceOf(receiver)
      assert.equal(receiver_balance.toString(), qty)
    })

    it("should not be able to send more tokens then available", async () => {
      //we transfered 1 token above, deployer is starting with 999,999
      await myToken.transfer(receiver, init_owner_balance, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
    })
  
  })


})
