// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "./BadgerCore.sol";
import "./interfaces/ITrustAttestor.sol";

contract TrustSigil is BadgerCore {

    address constant ADDRESS_ONE = 0x1111111111111111111111111111111111111111;

    mapping(uint256 => ITrustAttestor) public trustAttestors;

    constructor(string memory _baseUri) BadgerCore(_baseUri) {}

    /// @dev sets up a new sigil with or without a trustAttestor for a specific tokenId
    /// @param tokenId tokenId of sigil
    /// @param trustAttestor address of attestor contract, setting to ADDRESS_ONE means no attestor
    function setupSigil(
        uint256 tokenId,
        ITrustAttestor trustAttestor
    ) public {
        require(address(trustAttestors[tokenId]) == address(0), "tokenId already used");
        trustAttestors[tokenId] = trustAttestor;
    }

    /// @dev sets up a new sigil with or without a trustAttestor for a specific tokenId
    /// @param recipient recipient of sigil
    /// @param tokenId tokenId of sigil
    /// @param data encoded parameters that are required by attestor contract for attesting
    function mintSigil(
        address recipient,
        uint256 tokenId,
        bytes memory data
    ) public {
        bytes memory tokenData;
        require(
            address(
                trustAttestors[tokenId]) == ADDRESS_ONE
                || trustAttestors[tokenId].attestMint(msg.sender, recipient, data
            ),
            "No trust attestation"
        );
        _mint(recipient, tokenId, 1, tokenData);
    }
}

