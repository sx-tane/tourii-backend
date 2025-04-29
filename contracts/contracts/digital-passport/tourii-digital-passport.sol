// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TouriiDigitalPassport is ERC721, Ownable {
    constructor()
        ERC721('Tourii Digital Passport', 'TOURII')
        Ownable(msg.sender)
    {}

    uint256 public nextTokenId;

    mapping(uint256 => string) private _tokenURIs;

    event PassportMinted(address indexed to, uint256 indexed tokenId);
    event MetadataURIUpdated(uint256 indexed tokenId, string newURI);

    function mint(
        address to,
        string memory uri
    ) external onlyOwner returns (uint256) {
        // Changed: onlyAdmin to onlyOwner
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
        emit PassportMinted(to, tokenId);
        return tokenId;
    }

    function updateMetadataURI(
        uint256 tokenId,
        string memory newURI
    ) public onlyOwner {
        ownerOf(tokenId);
        _tokenURIs[tokenId] = newURI;
        emit MetadataURIUpdated(tokenId, newURI);
    }

    // Override ERC721's tokenURI
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        ownerOf(tokenId);
        return _tokenURIs[tokenId];
    }

    // Override ERC721's supportsInterface
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
