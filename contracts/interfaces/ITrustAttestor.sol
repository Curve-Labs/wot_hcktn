// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

/// @dev states functions that need to be implemented by a trust attestor
interface ITrustAttestor {
    /// @dev attests that trust sigil with tokenId can be minted to recipient
    /// @param recipient recipient of trust sigil
    /// @param sender sender of trust sigil
    /// @param data encoded parameters that the respective attestor implementation requires for attesting
    function attestMint(address sender, address recipient, bytes memory data) external returns (bool);
}