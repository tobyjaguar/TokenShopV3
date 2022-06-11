pragma solidity ^0.5.17;

import './SafeMath.sol';

interface Token {
  function totalSupply() external view returns (uint256);
  function balanceOf(address owner) external view returns (uint256);
  function name() external view returns(string memory);
  function symbol() external view returns(string memory);
  function decimals() external view returns(uint8);
  function allowance(address owner, address spender) external view returns (uint256);
  function transfer(address to, uint256 value) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address private _owner;

  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    _owner = msg.sender;
  }

  /**
   * @return the address of the owner.
   */
  function owner() public view returns(address) {
    return _owner;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  /**
   * @return true if `msg.sender` is the owner of the contract.
   */
  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(_owner);
    _owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}

contract TokenShop is Ownable {
  using SafeMath for uint256;

  string public native;
  mapping(string => address) public tokens;

  event LogBuyToken(address eSender, uint256 eTokenAmount);
  event LogApproval(address eSender, uint256 eAmount);
  event LogDeposit(address eSender, uint256 eValue);
  event LogWithdraw(address eSender, uint256 eValue);

  constructor(string memory _name, address _instance) public {
     native = _name;
     tokens[native] = _instance;
  }

  //Token functions
  function getTokenSupply()
    public
    view
    returns (uint256)
  {
    Token tokenContract = Token(tokens[native]);
    return tokenContract.totalSupply();
  }

  function getTokenBalance(address _account)
    public
    view
    returns (uint256)
  {
    Token tokenContract = Token(tokens[native]);
    return tokenContract.balanceOf(_account);
  }

  function getTokenName()
    public
    view
    returns (string memory)
  {
    Token tokenContract = Token(tokens[native]);
    return tokenContract.name();
  }

  function getTokenSymbol()
    public
    view
    returns (string memory)
  {
    Token tokenContract = Token(tokens[native]);
    return tokenContract.symbol();
  }

  function getTokenDecimals()
    public
    view
    returns (uint8)
  {
    Token tokenContract = Token(tokens[native]);
    return tokenContract.decimals();
  }

  //User functions
    function approveTransfer(string memory _name, uint256 _amount)
    public
    returns (bool)
 {
    //check stable token known to shop
    require(tokens[_name] != address(0), "stable token not recognized");
    Token tokenContract = Token(tokens[_name]);
    tokenContract.approve(address(this), _amount);
    emit LogApproval(msg.sender, _amount);
    return true;
 }

  function buyToken(string memory _name, uint256 _amount)
    public
    returns (bool)
  {
    // check stable token known to shop
    require(tokens[_name] != address(0), "stable token not recognized");
    Token nativeTokenContract = Token(tokens[native]);
    Token stableTokenContract = Token(tokens[_name]);
    //check not asking for more than shop balance
    require(nativeTokenContract.balanceOf(address(this)) >= _amount, "insufficient shop balance");
    //check not asking for more than user blaance
    require(stableTokenContract.balanceOf(msg.sender) >= _amount, "insufficient user balance");
    require(stableTokenContract.allowance(msg.sender, address(this)) >= _amount, "insufficient allowance");
    require(stableTokenContract.transferFrom(msg.sender, address(this), _amount), "stable token transfer failed");
    require(nativeTokenContract.transfer(msg.sender, _amount), "native token transfer filed");
    emit LogBuyToken(msg.sender, _amount);
    return true;
  }

  //Shop functions
  function getShopStock()
    public
    view
    returns (uint256)
  {
    Token nativeTokenContract = Token(tokens[native]);
    return nativeTokenContract.balanceOf(address(this));
  }

  function getStableToken(string memory name)
    public
    view
    returns (address)
  {
    return tokens[name];
  }

  // Admin Functions
  function setStableToken(string memory _name, address _address)
    onlyOwner
    public
    returns (bool)
  {
    tokens[_name] = _address;
    return true;
  }

  function deposit(uint256 _amount)
    onlyOwner
    public
    returns (bool)
  {
    Token nativeTokenContract = Token(tokens[native]);
    require(nativeTokenContract.transferFrom(msg.sender, address(this), _amount), "transfer failed");
    emit LogDeposit(msg.sender, _amount);
    return true;
  }

  function withdraw(string memory _name, uint256 _amount)
    onlyOwner
    public
    returns (bool)
  {
    Token tokenContract = Token(tokens[_name]);
    require(tokenContract.balanceOf(address(this)) >= _amount, "insufficient balance");
    require(tokenContract.transfer(msg.sender, _amount), "transfer failed");
    emit LogWithdraw(msg.sender, _amount);
    return true;
  }

  function kill()
    onlyOwner
    public
  {
    selfdestruct(msg.sender);
  }


}
