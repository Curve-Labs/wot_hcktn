// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "../interfaces/ITrustAttestor.sol";


contract OrbisBridge is ITrustAttestor{
    using ECDSA for bytes32;

    function attest(address recipient, uint256 tokenId, bytes memory data) external pure returns(bool) {
        return true;
    }

    function verify(bytes32 data, bytes memory signature, address account) public pure returns (bool) {
        return data
            .toEthSignedMessageHash()
            .recover(signature) == account;
    }
}

