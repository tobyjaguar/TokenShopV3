pragma solidity ^0.4.24;

import './openzeppelin-solidity/ERC20.sol';
import './openzeppelin-solidity/ERC20Detailed.sol';
import './openzeppelin-solidity/ERC20Burnable.sol';
import './openzeppelin-solidity/ERC20Mintable.sol';
import './openzeppelin-solidity/ERC20Pausable.sol';

contract ERC20TobyToken is ERC20, ERC20Detailed, ERC20Pausable, ERC20Mintable, ERC20Burnable {

  constructor(
    string name,
    string symbol,
    uint8 decimals
  )
    ERC20Burnable()
    ERC20Mintable()
    ERC20Detailed(name,symbol,decimals)
    ERC20()
    public
  {}

}
