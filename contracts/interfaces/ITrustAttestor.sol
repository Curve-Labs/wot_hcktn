// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;


interface ITrustAttestor {

    /// @dev attests that trust sigil with tokenId can be minted to recipient
    /// @param recipient recipient of trust sigil
    /// @param tokenId recipient of trust sigil
    /// @param data encoded parameters that the respective attestor implementation requires for attesting
    function attest(address recipient, uint256 tokenId, bytes memory data) external returns (bool);
}