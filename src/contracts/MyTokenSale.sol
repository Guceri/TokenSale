//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CrowdSale.sol";

//this contract will 'own' the tokens and distribute the tokens
//eth will be sent to a specific wallet address

contract MyTokenSale is CrowdSale {

  //how much wei a token costs, the wallet that recieves ether, address of token
  constructor (uint256 rate, address payable wallet, IERC20 token) CrowdSale (rate, wallet, token) {
  }

}