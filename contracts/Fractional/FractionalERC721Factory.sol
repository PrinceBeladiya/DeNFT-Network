pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./FractionalERC20Vault.sol";
import "hardhat/console.sol";

contract FractionalERC721Factory {
    uint256 public vaultCount = 0;

    mapping(uint256 => address) public vaultToVaultContract;

    constructor() {}

    function mint(
        address _nftCollection,
        uint256 _id,
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _listPrice
    ) public returns (uint256 _vaultCount) {

        FractionalERC20Vault fractionalERC20VaultAddress = new FractionalERC20Vault(
            msg.sender,
            _nftCollection,
            _id,
            _name,
            _symbol,
            _totalSupply,
            _listPrice
        );

        IERC721(_nftCollection).transferFrom(
            msg.sender,
            address(fractionalERC20VaultAddress),
            _id
        );

        vaultToVaultContract[vaultCount] = address(fractionalERC20VaultAddress);
        vaultCount++;
        return vaultCount;
    }
}
