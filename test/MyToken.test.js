const MyToken = artifacts.require("MyToken")
//web3 is automatically injected into truffle tests

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("MyToken", async ([deployer,receiver]) => {
  let myToken, totalSupply, owner_balance

  //hook to run before the first 'it' or 'describe'
  beforeEach(async () => {
    myToken = await MyToken.new(1000000)
    totalSupply = await myToken.totalSupply()
    owner_balance = await myToken.balanceOf(deployer)
  })

  describe('deployment', async () => {
    it("should transfer all tokens to deployer account", async () => {
      owner_balance.toString().should.equal(totalSupply.toString(), "full transfer of tokens to owner")
    })

    it("should be possible to send tokens between accounts", async() => {
      const qty = 1
      await myToken.transfer(receiver, qty, {from: deployer})
      //INSERT BALANCE CHECK LOGIC HERE
    })
  })


})
