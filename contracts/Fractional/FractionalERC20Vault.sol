pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract FractionalERC20Vault is ERC20 {
    address public nftCollection;
    uint256 public immutable nftId;

    address public owner;

    uint256 public reservePrice;

    constructor(
        address _owner,
        address _nftCollection,
        uint256 _id,
        string memory _name,
        string memory _symbol,
        uint256 _supply,
        uint256 _listPrice
    ) ERC20(_name, _symbol) {

        owner = _owner;
        nftCollection = _nftCollection;

        _mint(_owner, _supply);

        nftId = _id;
        reservePrice = _listPrice;
    }

    // ----------------------> Lend & borrow <-----------------------------

    // coming soon

    // -------------------> withdraw NFT if user accumulated 100% of the total supply <-----------------------

    function redeem() external {
        _burn(msg.sender, totalSupply());
        IERC721(nftCollection).transferFrom(address(this), msg.sender, nftId);
    }
}
