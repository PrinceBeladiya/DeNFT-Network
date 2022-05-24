const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Fractional Token", function () {

  let owner, account1, account2, account3;
  let fractionalERC721Factory;

  beforeEach('DeNFT', async () => {
    [owner, account1, account2, account3] = await ethers.getSigners();

    const DeNFT = await ethers.getContractFactory('DeNFTMock');
    deNFT = await DeNFT.deploy();

    const FractionalERC721Factory = await ethers.getContractFactory('FractionalERC721Factory');
    fractionalERC721Factory = await FractionalERC721Factory.deploy();

    await deNFT.connect(account1).mint();
    const balance = await deNFT.balanceOf(account1.address);
    console.log('balance=====', String(balance));

  });

  describe('Fractional Token deployment', () => {
    it('should create fractional token', async () => {

      fractionalERC721Factory.connect(account1).mint(deNFT.address, "Fraction1", "FR1", "10000");

    });
  });

});
