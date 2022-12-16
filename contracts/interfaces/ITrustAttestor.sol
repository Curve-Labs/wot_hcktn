// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;


interface ITrustAttestor {
    function attest(address recipient, uint256 tokenId, bytes memory data) external returns (bool);
}