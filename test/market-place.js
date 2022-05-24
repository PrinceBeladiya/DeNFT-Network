const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("DeNFT Token", function () {

  let owner, admin, treasury, buyer1, buyer2, buyer3, seller1, seller2, seller3, creator1;
  let marketPlaceInstance, weth, deNFT;

  beforeEach('DeNFT', async () => {
    [owner, buyer1, buyer2, buyer3, seller1, seller2, seller3, creator1] = await ethers.getSigners();

    const MarketPlace = await ethers.getContractFactory('MarketPlace');
    const WETH = await ethers.getContractFactory('WETH9');
    const DeNFT = await ethers.getContractFactory('DeNFT');

    weth = await WETH.deploy();
    deNFT = await DeNFT.deploy();

    marketPlaceInstance = await MarketPlace.deploy(weth.address);


  });

  describe('MarketPlace', () => {
    it('should add collection', async () => {

      await marketPlaceInstance.addCollection(deNFT.address, owner.address);
      const collections = await marketPlaceInstance.viewCollections("0", "10");
      // console.log('collections======', collections);
      assert.equal(collections[0][0], deNFT.address);
      assert.equal(collections[1][0][0], "1");

      const tokensForSell = await marketPlaceInstance.viewAsksByCollection(deNFT.address, "0", "100");
      // console.log('tokensForSell======', tokensForSell);
      assert.isEmpty(tokensForSell[0]);
      assert.isEmpty(tokensForSell[1]);
      assert.equal(String(tokensForSell[2]), "0");

      const tokensForSaleForSeller =  await marketPlaceInstance.viewAsksByCollectionAndSeller(deNFT.address, owner.address, "0", "100");
      assert.isEmpty(tokensForSaleForSeller[0]);
      assert.isEmpty(tokensForSaleForSeller[1]);
      assert.equal(String(tokensForSaleForSeller[2]), "0");
    });

    it('should let seller to list a NFT', async () => {

      await deNFT.mint({ value: ethers.utils.parseEther("0.1") });
      await deNFT.approve(marketPlaceInstance.address, 1);

      const askOrder = await marketPlaceInstance.createAskOrder(deNFT.address, 1, ethers.utils.parseEther("0.2"));

      const tokensForSell = await marketPlaceInstance.viewAsksByCollection(deNFT.address, "0", "100");
      // console.log('tokensForSell======', tokensForSell);
      assert.equal(tokensForSell[0], "1");
      assert.equal(String(tokensForSell[1][0].seller), owner.address);
      assert.equal(String(tokensForSell[1][0].price), ethers.utils.parseEther("0.2"));
      assert.equal(String(tokensForSell[2]), "1");

    });

  });

});
