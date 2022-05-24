//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendBorrow is ReentrancyGuard, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    IERC20 usdc;

    enum Status {
        Pending,
        Open,
        Close
    }

    EnumerableSet.AddressSet private _collectionAddressSet;

    mapping(address => mapping(uint256 => CollateralAsk)) private _askDetails;
    mapping(address => EnumerableSet.UintSet) private _askTokenIds;
    mapping(address => Collection) private _collections;
    mapping(address => mapping(address => EnumerableSet.UintSet)) private _tokenIdsOfSellerForCollection;

    mapping(address => mapping(uint256 => Loan)) private _activeLoanDetails;
    mapping(address => EnumerableSet.UintSet) private _activeLoanTokenIds;
    mapping(address => mapping(address => EnumerableSet.UintSet)) private _tokenIdsOfBorrowerForCollection;

    struct CollateralAsk {
        address seller;
        uint256 price ; // in wei
        uint256 repayInterestAmount;
        uint256 timeInDays;
        uint256 tokenId;
    }

    struct Loan {
        address lender;
        address borrower;
        uint256 endTime;
        uint256 repayInterestAmount;
        uint256 collateralPrice;
        uint256 tokenId;
        bool isActive;
    }

    struct Collection {
        Status status;
        address creatorAddress;
    }

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    function acceptAsk(address _collection, uint256 _tokenId, uint256 _price) external payable nonReentrant {
        require(IERC20(usdc).transferFrom(msg.sender, address(this), _price), "usdc transfer failed");
        _acceptAsk(_collection, _tokenId, _price);
    }

    function _acceptAsk(
        address _collection,
        uint256 _tokenId,
        uint256 _price
    ) internal {
        // require(_collections[_collection].status == Status.Open, "Collection is not for lending");
        require(_askTokenIds[_collection].contains(_tokenId), "Token is not for available for borrow");

        CollateralAsk memory askOrder = _askDetails[_collection][_tokenId];

        require(_price == askOrder.price, "Incorrect price");
        require(msg.sender != askOrder.seller, "Buyer cannot be seller");

        _tokenIdsOfSellerForCollection[askOrder.seller][_collection].remove(_tokenId);
        delete _askDetails[_collection][_tokenId];
        _askTokenIds[_collection].remove(_tokenId);

        _tokenIdsOfBorrowerForCollection[msg.sender][_collection].add(_tokenId);
        _activeLoanDetails[_collection][_tokenId] = Loan({
            lender: askOrder.seller,
            borrower: msg.sender,
            endTime: block.timestamp + askOrder.timeInDays,
            collateralPrice: askOrder.price,
            tokenId: _tokenId,
            repayInterestAmount: askOrder.repayInterestAmount,
            isActive: true
        });
        _activeLoanTokenIds[_collection].add(_tokenId);

        IERC721(_collection).safeTransferFrom(address(this), address(msg.sender), _tokenId);
    }

    function repayLoan( // calculate interest rate with USDC
        address _collection,
        uint256 _tokenId
    ) external payable {
        Loan storage loanDetails = _activeLoanDetails[_collection][_tokenId];
        require(loanDetails.isActive, "already borrowed");

        IERC721(_collection).safeTransferFrom(msg.sender, loanDetails.lender, _tokenId);

        uint256 remainingCollateral = loanDetails.collateralPrice - loanDetails.repayInterestAmount;
        require(IERC20(usdc).transfer(loanDetails.lender, loanDetails.repayInterestAmount));
        require(IERC20(usdc).transfer(msg.sender, remainingCollateral));

        _tokenIdsOfBorrowerForCollection[msg.sender][_collection].remove(_tokenId);
        delete _activeLoanDetails[_collection][_tokenId];
        _activeLoanTokenIds[_collection].remove(_tokenId);
    }


    function createLoanAskOrder(
        address _collection,
        uint256 _tokenId,
        uint256 _askPrice,
        uint256 _repayInterestAmount,
        uint256 _timeInDays
    ) public nonReentrant {
        Loan memory loanDetails = _activeLoanDetails[_collection][_tokenId];
        require(!loanDetails.isActive, "already borrowed");

        IERC721(_collection).transferFrom(address(msg.sender), address(this), _tokenId);

        _tokenIdsOfSellerForCollection[msg.sender][_collection].add(_tokenId);    
        _askDetails[_collection][_tokenId] = CollateralAsk({
            seller: msg.sender,
            price: _askPrice,
            repayInterestAmount: _repayInterestAmount,
            tokenId: _tokenId,
            timeInDays: (_timeInDays * 60 * 60)
        });
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
        // require(_collections[_collection].status == Status.Open, "Collection is not for listing");
        require(_tokenIdsOfSellerForCollection[msg.sender][_collection].contains(_tokenId), "Token is not listed");

        _askDetails[_collection][_tokenId].price = _newPrice;
    }

    function viewAsksByCollectionAndTokenIds(address collection, uint256[] calldata tokenIds)
        external
        view
        returns (bool[] memory statuses, CollateralAsk[] memory askInfo)
    {
        uint256 length = tokenIds.length;

        statuses = new bool[](length);
        askInfo = new CollateralAsk[](length);

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
        CollateralAsk[] memory askInfo,
        uint256
        )
    {
        uint256 length = size;

        if (length > _askTokenIds[collection].length() - cursor) {
            length = _askTokenIds[collection].length() - cursor;
        }

        tokenIds = new uint256[](length);
        askInfo = new CollateralAsk[](length);

        for (uint256 i = 0; i < length; i++) {
            tokenIds[i] = _askTokenIds[collection].at(cursor + i);
            askInfo[i] = _askDetails[collection][tokenIds[i]];
        }

        return (tokenIds, askInfo, cursor + length);
    }

function viewAsksByCollectionAndTokenIdsOfBorrower(address collection, uint256[] calldata tokenIds)
        external
        view
        returns (bool[] memory statuses, Loan[] memory askInfo)
    {
        uint256 length = tokenIds.length;

        statuses = new bool[](length);
        askInfo = new Loan[](length);

        for (uint256 i = 0; i < length; i++) {
            if (_activeLoanTokenIds[collection].contains(tokenIds[i])) {
                statuses[i] = true;
            } else {
                statuses[i] = false;
            }

            askInfo[i] = _activeLoanDetails[collection][tokenIds[i]];
        }

        return (statuses, askInfo);
    }

    function viewAsksByCollectionOfBorrower(
        address collection,
        uint256 cursor,
        uint256 size
    )
        external
        view
        returns (
        uint256[] memory tokenIds,
        Loan[] memory askInfo,
        uint256
        )
    {
        uint256 length = size;

        if (length > _activeLoanTokenIds[collection].length() - cursor) {
            length = _activeLoanTokenIds[collection].length() - cursor;
        }

        tokenIds = new uint256[](length);
        askInfo = new Loan[](length);

        for (uint256 i = 0; i < length; i++) {
            tokenIds[i] = _activeLoanTokenIds[collection].at(cursor + i);
            askInfo[i] = _activeLoanDetails[collection][tokenIds[i]];
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
            CollateralAsk[] memory askInfo,
            uint256
        )
    {
        uint256 length = size;

        if (length > _tokenIdsOfSellerForCollection[seller][collection].length() - cursor) {
            length = _tokenIdsOfSellerForCollection[seller][collection].length() - cursor;
        }

        tokenIds = new uint256[](length);
        askInfo = new CollateralAsk[](length);

        for (uint256 i = 0; i < length; i++) {
            tokenIds[i] = _tokenIdsOfSellerForCollection[seller][collection].at(cursor + i);
            askInfo[i] = _askDetails[collection][tokenIds[i]];
        }

        return (tokenIds, askInfo, cursor + length);
    }

    

    function addCollection(
        address _collection,
        address _creator
    ) external onlyOwner {
        require(!_collectionAddressSet.contains(_collection), "Collection already listed");

        _collectionAddressSet.add(_collection);

        _collections[_collection] = Collection({
            status: Status.Open,
            creatorAddress: _creator
        });
    }

}
