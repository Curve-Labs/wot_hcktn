// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgerCore is ERC1155Supply, Ownable {
    /*
        State Variables
    */

    /// @notice stores token URIs for corresponding token (category) ID
    /// @return tokenUri of queried token (category) ID
    mapping(uint256 => string) public tokenUris;


    /*
        Events
    */

    event TokenUriUpdated(uint256 tokenId, string uri);

    /*
        Errors
    */
    // transfer of token is disabled
    error TransferDisabled();

    /*
        Modifiers
    */
    modifier isSameLength(
        address[] calldata accounts,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) {
        require(
            accounts.length == tokenIds.length &&
                tokenIds.length == amounts.length,
            "Input array mismatch"
        );
        _;
    }

    /*
        Constructor
    */
    constructor(string memory _baseUri) ERC1155(_baseUri) {}

    /*
        Configuration
    */

    /// @notice sets a uri for a token to be appended to baseUri
    /// @dev only owner can change baseURI for a particular token (category) ID
    /// @param tokenId id of token (category)
    /// @param newUri uri to be appended
    function setUri(uint256 tokenId, string memory newUri) external onlyOwner {
        tokenUris[tokenId] = newUri;
        emit TokenUriUpdated(tokenId, newUri);
    }

    /// @notice sets a base uri for all token (category) ids
    /// @dev only owner can change base URI for all token ids
    /// @param baseUri base uri (is appended by tokenUri)
    function setBaseUri(string memory baseUri) external onlyOwner {
        _setURI(baseUri);
    }

    /*
        Transferring
    */

    /// @dev override method to disable transfer
    /// @inheritdoc	ERC1155
    function setApprovalForAll(address, bool) public virtual override {
        revert TransferDisabled();
    }

    /// @dev override method to disable transfer
    /// @inheritdoc	ERC1155
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        if (to != address(0) && from != address(0)) {
            revert TransferDisabled();
        }

        super._beforeTokenTransfer(
            operator,
            from,
            to,
            ids,
            amounts,
            data
        );
    }

    /*
        Metadata
    */

    /// @notice returns the uri for a given token
    /// @dev consists of a concatenation of baseUri and uriId
    /// @param tokenId tokenId for which the uri should be retrieved
    /// @return token uri which can be queries to return data
    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        string memory baseUri = super.uri(tokenId);
        return string(abi.encodePacked(baseUri, tokenUris[tokenId]));
    }
}
