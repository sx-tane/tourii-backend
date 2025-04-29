// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TouriiDigitalPassport is ERC721URIStorage, Ownable {
    constructor() ERC721("Tourii Digital Passport", "TOURII") Ownable(msg.sender) {
        admin = msg.sender;
    }

    uint256 public nextTokenId;
    address public admin;

    mapping(uint256 => string) private _tokenURIs;

    event PassportMinted(address indexed to, uint256 indexed tokenId);
    event MetadataURIUpdated(uint256 indexed tokenId, string newURI);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function mint(address to, string memory uri) external onlyAdmin returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
        emit PassportMinted(to, tokenId);
        return tokenId;
    }

    function updateMetadataURI(uint256 tokenId, string memory newURI) public onlyOwner {
        _tokenURIs[tokenId] = newURI;
        emit MetadataURIUpdated(tokenId, newURI);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
