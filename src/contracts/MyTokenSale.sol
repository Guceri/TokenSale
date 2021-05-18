//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CrowdSale.sol";
import "./KycContract.sol";

//this contract will 'own' the tokens and distribute the tokens
contract MyTokenSale is CrowdSale {

  //declare instance of our contract (address) as type KycContract (the contract object we imported)
  KycContract kyc;

  //rate -> the exchange rate of token to eth (set at 1 wei = 1 token)
  //wallet -> the deployers account address 
  //token -> the address of our token (note: we don't need to import the IERC object in this contract because it is inherited)
  //_kyc -> the address of our kyc contract
  //NOTE-> we are passing constructor inputs from this contract to the crowdsale (inherited) contract (notice no type listed for the variables in crowdsale)
  constructor (uint256 rate, address payable wallet, IERC20 token, KycContract _kyc)  CrowdSale (rate, wallet, token) {
    kyc = _kyc;
  }

  function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
    //since we override the contract, we want to use the original code, so we use super
    super._preValidatePurchase(beneficiary, weiAmount);
    //additional funtionality of the function is done below
    require(kyc.kycCheck(msg.sender), "KYC not completed, purchase not allowed");
  }

}