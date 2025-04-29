// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TouriiPerk is ERC721Burnable, ERC721URIStorage, Ownable {
    constructor() ERC721('Tourii Perk', 'TOURIIPERK') Ownable(msg.sender) {
        // Removed: admin = msg.sender;
    }

    uint256 public nextTokenId;
    // Removed: address public admin;

    event PerkMinted(address indexed to, uint256 indexed tokenId);

    function mint(
        address to,
        string memory uri
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit PerkMinted(to, tokenId);
        return tokenId;
    }

    function burn(uint256 tokenId) public override {
        _burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
