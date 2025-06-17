// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';

contract TouriiDigitalPassport is ERC721, Ownable, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    constructor(string memory baseURI)
        ERC721('Tourii Digital Passport', 'TOURII')
        Ownable(msg.sender)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
        _baseTokenURI = baseURI;
    }

    uint256 public nextTokenId;
    uint256 public maxSupply = 100000; // Maximum passports that can be minted
    string private _baseTokenURI;
    
    mapping(address => bool) public hasPassport; // One passport per address
    mapping(address => uint256) public userPassportId; // Track user's passport token ID

    event PassportMinted(address indexed to, uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);
    event MaxSupplyUpdated(uint256 newMaxSupply);

    function mint(
        address to
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(nextTokenId < maxSupply, "Max supply reached");
        require(!hasPassport[to], "Address already has a passport");
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        hasPassport[to] = true;
        userPassportId[to] = tokenId;
        
        emit PassportMinted(to, tokenId);
        return tokenId;
    }

    function updateBaseURI(
        string memory newBaseURI
    ) public onlyRole(UPDATER_ROLE) {
        require(bytes(newBaseURI).length > 0, "Base URI cannot be empty");
        
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
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

    // Override ERC721's tokenURI to use base URI pattern
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        return string(abi.encodePacked(_baseTokenURI, toString(tokenId), ".json"));
    }

    // Get base URI (for transparency)
    function baseURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    // Helper function to convert uint256 to string
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Function to get passport token ID by user address
    function getPassportIdByOwner(address owner) external view returns (uint256) {
        require(hasPassport[owner], "User does not have a passport");
        return userPassportId[owner];
    }

    // Override supportsInterface to include AccessControl
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Transfer override to update hasPassport and userPassportId mappings
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        // Update hasPassport and userPassportId mappings on transfer
        if (from != address(0)) {
            hasPassport[from] = false;
            delete userPassportId[from];
        }
        if (to != address(0)) {
            hasPassport[to] = true;
            userPassportId[to] = tokenId;
        }
        
        return super._update(to, tokenId, auth);
    }
}
