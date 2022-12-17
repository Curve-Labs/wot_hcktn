// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "../interfaces/ITrustAttestor.sol";


contract OrbisBridge is ITrustAttestor{
    using ECDSA for bytes32;


    /// See {ITrustAttestor-attest}.
    // TODO: implement
    function attest(address recipient, uint256 tokenId, bytes memory data) external pure returns(bool) {
        return true;
    }


    // this implementation is just to exemplify how a simple signature verification function can look like
    // TODO: remove if attest function has been implemented 
    function verify(bytes memory signature, address account) public view returns (bool) {

        bytes32 msgHash = keccak256(abi.encodePacked(msg.sender));

        return msgHash
            .toEthSignedMessageHash()
            .recover(signature) == account;
    }
}

