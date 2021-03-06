//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MyToken is ERC20 {

  function decimals() public pure override returns (uint8) {
    return 0;//change decimals to zero
  }

  constructor(uint initialSupply) ERC20("StarDucks Cappucino Token", "CAPPU") {
    _mint(msg.sender, initialSupply); //erc20 function
  }

}
