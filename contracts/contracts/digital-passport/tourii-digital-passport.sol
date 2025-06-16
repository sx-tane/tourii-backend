// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';

contract TouriiDigitalPassport is ERC721, Ownable, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    constructor()
        ERC721('Tourii Digital Passport', 'TOURII')
        Ownable(msg.sender)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }

    uint256 public nextTokenId;
    uint256 public maxSupply = 100000; // Maximum passports that can be minted
    
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => bool) public hasPassport; // One passport per address

    event PassportMinted(address indexed to, uint256 indexed tokenId);
    event MetadataURIUpdated(uint256 indexed tokenId, string newURI);
    event MaxSupplyUpdated(uint256 newMaxSupply);

    function mint(
        address to,
        string memory uri
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(nextTokenId < maxSupply, "Max supply reached");
        require(!hasPassport[to], "Address already has a passport");
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
        hasPassport[to] = true;
        
        emit PassportMinted(to, tokenId);
        return tokenId;
    }

    function updateMetadataURI(
        uint256 tokenId,
        string memory newURI
    ) public onlyRole(UPDATER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(bytes(newURI).length > 0, "URI cannot be empty");
        
        _tokenURIs[tokenId] = newURI;
        emit MetadataURIUpdated(tokenId, newURI);
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply >= nextTokenId, "Max supply cannot be less than current supply");
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

    // Override ERC721's tokenURI
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        ownerOf(tokenId);
        return _tokenURIs[tokenId];
    }

    // Override supportsInterface to include AccessControl
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Transfer override to update hasPassport mapping
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        // Update hasPassport mapping on transfer
        if (from != address(0)) {
            hasPassport[from] = false;
        }
        if (to != address(0)) {
            hasPassport[to] = true;
        }
        
        return super._update(to, tokenId, auth);
    }
}
