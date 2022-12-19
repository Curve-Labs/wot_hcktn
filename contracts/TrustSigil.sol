// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "./BadgerCore.sol";
import "./interfaces/ITrustAttestor.sol";

contract TrustSigil is BadgerCore { 

    struct Node { 
      uint256 tokenId;
    }

    event SigilMinted(address sender, address recipient, uint256 tokenId, uint256 timestamp);

    address constant ADDRESS_ONE = 0x1111111111111111111111111111111111111111;

    // stores contract addresses for trust attestors
    mapping(uint256 => ITrustAttestor) public trustAttestors;
    // tokenId => (recipient => (sender => mintTimestamp))
    // allows anyone to check if recipient is trusted by sender
    // as represented by recipient having received sigil (w tokenId) from sender
    mapping(uint256 => mapping(address => mapping(address => uint256))) public sigils;

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

        // records who received sigil from whom, when
        sigils[tokenId][recipient][msg.sender] = block.number;

        _mint(recipient, tokenId, 1, tokenData);
        emit SigilMinted(msg.sender, recipient, tokenId, block.number);
    }

    function getSigil(uint256 tokenId, address recipient, address sender) public view returns (uint256 blockNumber) {
        blockNumber = sigils[tokenId][recipient][sender];
    }
}

