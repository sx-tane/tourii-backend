// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TouriiLog is ERC721URIStorage, Ownable, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    constructor() ERC721("Tourii Log", "TOURIILOG") Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    uint256 public nextTokenId;
    uint256 public maxSupply;
    
    mapping(uint256 => string) public logCategory; // milestone category
    mapping(address => uint256[]) public userLogs; // logs owned by user

    event LogMinted(address indexed to, uint256 indexed tokenId, string category);
    event MaxSupplyUpdated(uint256 newMaxSupply);

    function mint(
        address to, 
        string memory uri,
        string memory category
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(maxSupply == 0 || nextTokenId < maxSupply, "Max supply reached");
        require(bytes(uri).length > 0, "URI cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");
        
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        logCategory[tokenId] = category;
        userLogs[to].push(tokenId);
        
        emit LogMinted(to, tokenId, category);
        return tokenId;
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

    function getUserLogs(address user) external view returns (uint256[] memory) {
        return userLogs[user];
    }

    function getLogsByCategory(string memory category) external view returns (uint256[] memory) {
        uint256[] memory categoryLogs = new uint256[](nextTokenId);
        uint256 count = 0;
        
        for (uint256 i = 0; i < nextTokenId; i++) {
            if (keccak256(bytes(logCategory[i])) == keccak256(bytes(category))) {
                categoryLogs[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = categoryLogs[i];
        }
        
        return result;
    }

    // Override supportsInterface to include AccessControl
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Update userLogs mapping on transfer
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        // Remove from previous owner's logs
        if (from != address(0)) {
            uint256[] storage fromLogs = userLogs[from];
            for (uint256 i = 0; i < fromLogs.length; i++) {
                if (fromLogs[i] == tokenId) {
                    fromLogs[i] = fromLogs[fromLogs.length - 1];
                    fromLogs.pop();
                    break;
                }
            }
        }
        
        // Add to new owner's logs
        if (to != address(0)) {
            userLogs[to].push(tokenId);
        }
        
        return super._update(to, tokenId, auth);
    }
}