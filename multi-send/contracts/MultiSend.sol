// SPDX-License-Identifier: No License

pragma solidity ^0.8.0;

contract MultiSend {
    function multiSend(address[] memory _addresses, uint256 _amount)
        public
        payable
    {
        uint256 length = _addresses.length;
        require(length * _amount == msg.value, "Incorrect amount");
        for (uint256 i = 0; i < _addresses.length; i++) {
            payable(_addresses[i]).transfer(_amount * 1 wei);
        }
    }
}
