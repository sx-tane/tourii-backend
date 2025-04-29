// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TouriiLog is ERC721URIStorage, Ownable {
  
  constructor() ERC721("Tourii Log", "TOURIILOG") Ownable(msg.sender) {
  }

  uint256 public nextTokenId;
\
  event LogMinted(address indexed to, uint256 indexed tokenId);

  function mint(address to, string memory uri) external onlyOwner returns (uint256)   {
    uint256 tokenId = nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    emit LogMinted(to, tokenId);
    return tokenId;
  }
}