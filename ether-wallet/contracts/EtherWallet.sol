pragma solidity ^0.5.0;

contract EtherWallet {
    
  address public owner;
  
  constructor(address _owner) public {
    owner = _owner;
  }
  
  function deposit() payable public {
      
  }
  
  function send(address payable to, uint amount) public {
    if (owner == msg.sender) {
      to.transfer(amount);
      return;
    }
    revert('sender is not allowed');
  }
  
  function balanceOf() view public returns (uint) {
    return address(this).balance;
  }
    
}