import React, { Component } from "react";
import MyToken from "./abis/MyToken.json";
import MyTokenSale from "./abis/MyTokenSale.json";
import KycContract from "./abis/KycContract.json";
import Web3 from 'web3';
import './App.css';


class App extends Component {

  async componentDidMount() {
    
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum) 
      
    }else {
      window.alert('Please install MetaMask')
      window.location.assign("https://metamask.io/")
    }

    const web3 = window.web3

    //make metaMask pop up to log into
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
    const account = await accounts[0]
    this.setState({ account })  

    const networkId = await window.ethereum.request({ method: 'net_version' })

    // Load DaiToken
    //pulls the network data from the .json file so we can get the address
    const MyTokenData = MyToken.networks[networkId]
    const MyTokenSaleData = MyTokenSale.networks[networkId]
    const KycContractData = KycContract.networks[networkId]

    /*
    check that the token sale has a contract instance on the current web3 network
    the rest of the contracts are assumed to have contracts on the same networks 
    since the tokensale contract takes the other contract addresses as inputs 
    (see migration file)
    */

    if(MyTokenSaleData) {
      const myToken = new web3.eth.Contract(MyToken.abi, MyTokenData.address)
      this.setState({ myToken })
      const myTokenSale = new web3.eth.Contract(MyTokenSale.abi, MyTokenSaleData.address)
      this.setState({ myTokenSale })
      this.setState({tokenSaleAddress: MyTokenSaleData.address})
      const kycContract = new web3.eth.Contract(KycContract.abi, KycContractData.address)
      this.setState({ kycContract })
    } else {
      window.alert('This token is not deployed to detected network.')
    }


    //refresh page on network change event
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    //refresh user account on account change event
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      const account = await accounts[0]
      if(typeof account !== 'undefined'){
        this.setState({ account })
        this.updateUserTokens()
      } else {
        //make metaMask pop up to log into
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0]
        this.setState({ account })
      }
    })

    this.listenToTokenTransfer()
    this.updateUserTokens()
    this.setState({ loading: false })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      tokenSaleAddress: '',
      myToken: null,
      myTokenSale: null,
      kycContract: null,
      kycAddress: '0x123',
      userTokens: 0,
      qty: 0,
      loading: true
    }
  }


  //from react website => this allows every key stroke to be tracked so the value is updated in real time
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.setState({ [name]: value})
  }

  handleKYC = async() => {
    await this.state.kycContract.methods.setKycCompleted(this.state.kycAddress).send({from: this.state.account})
    alert("KYC for "+this.state.kycAddress+" is completed")
  }

  updateUserTokens = async () => {
    let userTokens = await this.state.myToken.methods.balanceOf(this.state.account).call()
    this.setState({userTokens})
  }

  listenToTokenTransfer = async() => {
    this.state.myToken.events.Transfer({to: this.state.account}, async (error,event) => {
      this.updateUserTokens()
    })
  }

  handleBuyTokens = async() => {
    await this.state.myTokenSale.methods.buyTokens(this.state.account).send({from: this.state.account, value: this.state.qty })
  }

  render() {
    if(this.state.loading){
      return (
        <div className="App">
          <h2>Loading...</h2>
        </div>
      )
    }

    return (
      <div className="App">
        <h1>My Token Sale</h1>
        <p>Get your Tokens here!</p>
        <h2>KYC Whitelisting</h2>
        Address to allow (onlyOwner): <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleKYC}>Whitelist</button>
        <h2>Buy Tokens</h2>
        <p>If you want to buy tokens, send Wei to this address: {this.state.tokenSaleAddress}</p>
        <p>You currently have: {this.state.userTokens} CAPPU Tokens</p>
        Qty to buy: <input type="text" name="qty" value={this.state.qty} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleBuyTokens}> Buy more tokens</button>
      </div>
    );
  }
}

export default App;
