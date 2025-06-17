// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';

contract TouriiPerk is ERC721Burnable, ERC721URIStorage, Ownable, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    uint256 public nextTokenId;
    uint256 public maxSupply;
    string public perkCategory;
    
    mapping(uint256 => bool) public isRedeemed;

    event PerkMinted(address indexed to, uint256 indexed tokenId, string category);
    event PerkRedeemed(uint256 indexed tokenId, address indexed redeemer);
    event MaxSupplyUpdated(uint256 newMaxSupply);

    function mint(
        address to,
        string memory uri
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(maxSupply == 0 || nextTokenId < maxSupply, "Max supply reached");
        require(bytes(uri).length > 0, "URI cannot be empty");
        
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit PerkMinted(to, tokenId, perkCategory);
        return tokenId;
    }

    function burn(uint256 tokenId) public override {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender || hasRole(BURNER_ROLE, msg.sender), "Not authorized to burn");
        
        _burn(tokenId);
    }

    function redeemPerk(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!isRedeemed[tokenId], "Perk already redeemed");
        
        isRedeemed[tokenId] = true;
        emit PerkRedeemed(tokenId, msg.sender);
    }

    function setPerkCategory(string memory _category) external onlyOwner {
        perkCategory = _category;
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply == 0 || _maxSupply >= nextTokenId, "Max supply cannot be less than current supply");
        maxSupply = _maxSupply;
        emit MaxSupplyUpdated(_maxSupply);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function totalSupply() external view returns (uint256) {
        return nextTokenId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
