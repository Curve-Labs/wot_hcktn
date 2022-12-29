// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "../interfaces/ITrustAttestor.sol";


contract OrbisBridge is ITrustAttestor{
    using ECDSA for bytes32;

    // data params specific to this attestator implementation
    struct DataParams {
        address sender;
        address recipient;
    }

    // address of pkp that is used by lit action
    address public litActionPkp;

    constructor(address _litActionPkp) {
        litActionPkp = _litActionPkp;
    }

    /// See {ITrustAttestor-attest}.
    function attestMint(address sender, address recipient, bytes memory data) external view returns(bool) {
        bytes32 msgHash = keccak256(abi.encodePacked(sender, recipient));
        return msgHash.recover(data) == litActionPkp;
    }
}
