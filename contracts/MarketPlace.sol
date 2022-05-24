//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MarketPlace is ReentrancyGuard {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    using SafeERC20 for IERC20;

    enum Status {
        Pending,
        Open,
        Close
    }

    address public admin;

    EnumerableSet.AddressSet private _collectionAddressSet;

    mapping(address => mapping(uint256 => Ask)) private _askDetails;
    mapping(address => EnumerableSet.UintSet) private _askTokenIds;
    mapping(address => Collection) private _collections;
    mapping(address => mapping(address => EnumerableSet.UintSet)) private _tokenIdsOfSellerForCollection;

    struct Ask {
        address seller;
        uint256 price;
    }

    struct Collection {
        Status status;
        address creatorAddress;
    }

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function buyTokenUsingETH(address _collection, uint256 _tokenId) external payable nonReentrant {
        _buyToken(_collection, _tokenId, msg.value);
    }

    function _buyToken(
        address _collection,
        uint256 _tokenId,
        uint256 _price
    ) internal {
        // require(_collections[_collection].status == Status.Open, "Collection is not for trading");
        require(_askTokenIds[_collection].contains(_tokenId), "Token is not for sale");

        Ask memory askOrder = _askDetails[_collection][_tokenId];

        require(_price == askOrder.price, "Incorrect price");
        require(msg.sender != askOrder.seller, "Buyer cannot be seller");

        _tokenIdsOfSellerForCollection[askOrder.seller][_collection].remove(_tokenId);
        delete _askDetails[_collection][_tokenId];
        _askTokenIds[_collection].remove(_tokenId);

        require(payable(askOrder.seller).send(_price), "transfer failed");
        IERC721(_collection).safeTransferFrom(address(this), address(msg.sender), _tokenId);
    }

    function createAskOrder(
        address _collection,
        uint256 _tokenId,
        uint256 _askPrice
    ) external nonReentrant {
        IERC721(_collection).transferFrom(address(msg.sender), address(this), _tokenId);

        _tokenIdsOfSellerForCollection[msg.sender][_collection].add(_tokenId);
        _askDetails[_collection][_tokenId] = Ask({seller: msg.sender, price: _askPrice});

        _askTokenIds[_collection].add(_tokenId);
    }

    function cancelAskOrder(address _collection, uint256 _tokenId) external nonReentrant {
        require(_tokenIdsOfSellerForCollection[msg.sender][_collection].contains(_tokenId), "Token is not listed");

        _tokenIdsOfSellerForCollection[msg.sender][_collection].remove(_tokenId);
        delete _askDetails[_collection][_tokenId];
        _askTokenIds[_collection].remove(_tokenId);

        IERC721(_collection).transferFrom(address(this), address(msg.sender), _tokenId);
    }

    function modifyAskOrder(
        address _collection,
        uint256 _tokenId,
        uint256 _newPrice
    ) external nonReentrant {
        require(_collections[_collection].status == Status.Open, "Collection is not for listing");
        require(_tokenIdsOfSellerForCollection[msg.sender][_collection].contains(_tokenId), "Token is not listed");

        _askDetails[_collection][_tokenId].price = _newPrice;
    }

    function viewAsksByCollectionAndTokenIds(address collection, uint256[] calldata tokenIds)
        external
        view
        returns (bool[] memory statuses, Ask[] memory askInfo)
    {
        uint256 length = tokenIds.length;

        statuses = new bool[](length);
        askInfo = new Ask[](length);

        for (uint256 i = 0; i < length; i++) {
            if (_askTokenIds[collection].contains(tokenIds[i])) {
                statuses[i] = true;
            } else {
                statuses[i] = false;
            }

            askInfo[i] = _askDetails[collection][tokenIds[i]];
        }

        return (statuses, askInfo);
    }

    function viewAsksByCollection(
        address collection,
        uint256 cursor,
        uint256 size
    )
        external
        view
        returns (
            uint256[] memory tokenIds,
            Ask[] memory askInfo,
            uint256
        )
    {
        uint256 length = size;

        if (length > _askTokenIds[collection].length() - cursor) {
            length = _askTokenIds[collection].length() - cursor;
        }

        tokenIds = new uint256[](length);
        askInfo = new Ask[](length);

        for (uint256 i = 0; i < length; i++) {
            tokenIds[i] = _askTokenIds[collection].at(cursor + i);
            askInfo[i] = _askDetails[collection][tokenIds[i]];
        }

        return (tokenIds, askInfo, cursor + length);
    }

    function viewAsksByCollectionAndSeller(
        address collection,
        address seller,
        uint256 cursor,
        uint256 size
    )
        external
        view
        returns (
            uint256[] memory tokenIds,
            Ask[] memory askInfo,
            uint256
        )
    {
        uint256 length = size;

        if (length > _tokenIdsOfSellerForCollection[seller][collection].length() - cursor) {
            length = _tokenIdsOfSellerForCollection[seller][collection].length() - cursor;
        }

        tokenIds = new uint256[](length);
        askInfo = new Ask[](length);

        for (uint256 i = 0; i < length; i++) {
            tokenIds[i] = _tokenIdsOfSellerForCollection[seller][collection].at(cursor + i);
            askInfo[i] = _askDetails[collection][tokenIds[i]];
        }

        return (tokenIds, askInfo, cursor + length);
    }

    function addCollection(
        address _collection,
        address _creator
    ) external onlyAdmin {
        require(!_collectionAddressSet.contains(_collection), "Collection already listed");

        _collectionAddressSet.add(_collection);

        _collections[_collection] = Collection({
            status: Status.Open,
            creatorAddress: _creator
        });
    }

    function closeCollectionForTradingAndListing(address _collection) external onlyAdmin {
        require(_collectionAddressSet.contains(_collection), "Collection is not listed");

        _collections[_collection].status = Status.Close;
        _collectionAddressSet.remove(_collection);
    }

    function modifyCollection(
        address _collection,
        address _creator
    ) external onlyAdmin {
        require(_collectionAddressSet.contains(_collection), "Collection is not listed");

        _collections[_collection] = Collection({
            status: Status.Open,
            creatorAddress: _creator
        });
    }

    function viewCollections(uint256 cursor, uint256 size)
        external
        view
        returns (
            address[] memory collectionAddresses,
            Collection[] memory collectionDetails,
            uint256
        )
    {
        uint256 length = size;

        if (length > _collectionAddressSet.length() - cursor) {
            length = _collectionAddressSet.length() - cursor;
        }

        collectionAddresses = new address[](length);
        collectionDetails = new Collection[](length);

        for (uint256 i = 0; i < length; i++) {
            collectionAddresses[i] = _collectionAddressSet.at(cursor + i);
            collectionDetails[i] = _collections[collectionAddresses[i]];
        }

        return (collectionAddresses, collectionDetails, cursor + length);
    }
}