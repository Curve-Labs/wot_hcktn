// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "./BadgerCore.sol";
import "./interfaces/ITrustAttestor.sol";

contract TrustSigil is BadgerCore {

    address constant ADDRESS_ONE = 0x1111111111111111111111111111111111111111;

    mapping(uint256 => ITrustAttestor) public trustAttestors;

    constructor(string memory _baseUri) BadgerCore(_baseUri) {}

    function setupSigil(
        uint256 tokenId,
        ITrustAttestor trustAttestor
    ) public {
        require(address(trustAttestors[tokenId]) == address(0), "tokenId already used");
        trustAttestors[tokenId] = trustAttestor;
    }

    function mintSigil(
        address recipient,
        uint256 tokenId,
        bytes memory data
    ) public {
        bytes memory tokenData;
        require(
            address(
                trustAttestors[tokenId]) == ADDRESS_ONE 
                || trustAttestors[tokenId].attest(recipient, tokenId, data
            ),
            "No trust attestation"
        );
        _mint(recipient, tokenId, 1, tokenData);
    }
}

