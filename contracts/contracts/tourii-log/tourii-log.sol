// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TouriiLog is ERC721URIStorage, Ownable {
  
  constructor() ERC721("Tourii Log", "TOURIILOG") Ownable(msg.sender) {
    admin = msg.sender;
  }

  uint256 public nextTokenId;
  address public admin;


  function mint(address to, string memory uri) external onlyAdmin returns (uint256)   {
    uint256 tokenId = nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    return tokenId;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, "Not admin");
    _;
  }
}