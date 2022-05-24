const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeNFT Token", function () {

  let owner;
  let account1;
  let account2;
  let DeNFTInstance;
  let DeNFT;

  beforeEach('DeNFT', async () => {
    [owner, account1, account2, ...acc] = await ethers.getSigners();

    DeNFT = await ethers.getContractFactory('DeNFT');

    DeNFTInstance = await DeNFT.deploy();
  });

  describe('initial test', () => {
    it('is name of token set', async () => {
      let name = await DeNFTInstance.name();

      expect(name).to.equals("DeNFT");

    });

    it('is symbol of token set', async () => {
      let symbol = await DeNFTInstance.symbol();

      expect(symbol).to.equals("DNFT");

    });

  });

  describe("NFT creation testing", () => {

    it('can create NFT through mint function', async () => {
      await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      expect(await DeNFTInstance.balanceOf(owner.address)).to.equals(1);

    });

    it('if create mutiple NFT then tokenID is increment', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let tx2 = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt2 = await tx2.wait();
      receipt2.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("Your 2nd NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      it('if NFT create we can change owner', async () => {
        await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });
        const beforeMintTokens = await DeNFTInstance.ownerToTokens(owner.address);

        await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });
        const afterMintTokens = await DeNFTInstance.ownerToTokens(owner.address);

        expect(await DeNFTInstance.balanceOf(owner.address)).to.equals(1);
        expect(beforeMintTokens.length).to.equals(1);
        expect(afterMintTokens.length).to.equals(2);

      });

      let tx3 = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt3 = await tx3.wait();
      receipt3.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("Your 3rd NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      expect(tokens).to.equals(3);
      expect(await DeNFTInstance.balanceOf(owner.address)).to.equals(3);

    });

    it('if NFT create balance of owner is increment', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      let balance = await DeNFTInstance.balanceOf(owner.address);
      expect(balance).to.equals(tokens);

    });
  });

  describe('check ownerOf NFT', () => {
    it('can check owner through tokenID', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      let address = await DeNFTInstance.ownerOf(tokens);

      expect(await DeNFTInstance.balanceOf(owner.address)).to.equals(1);
      expect(address).to.equals(owner.address);

    });
  });

  describe('transfer test', () => {

    it('can transfer if dot have that NFT token', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      expect(await DeNFTInstance.balanceOf(owner.address)).to.equals(1);
      expect(await DeNFTInstance.ownerOf(1)).to.equals(owner.address)
      await expect(DeNFTInstance.connect(account1).transfer(owner.address, 1)).to.be.revertedWith('You dont have an access for do this transaction');

    });

    it('can transfer NFT token', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      await DeNFTInstance.transfer(account1.address, 1);

      expect(await DeNFTInstance.balanceOf(owner.address)).to.equals(0);
      expect(await DeNFTInstance.balanceOf(account1.address)).to.equals(1);
      expect(await DeNFTInstance.ownerOf(1)).to.equals(account1.address)

    });

  });

  describe("approve test", () => {
    it('cant approve assigned if dont have ownership', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      expect(await DeNFTInstance.ownerOf(1)).to.equals(owner.address);
      await expect(DeNFTInstance.connect(account1).approve(account2.address, 1)).to.be.revertedWith('You dont have access of this token');

    });

    it('can approve assign if have ownership of that token', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      let approval = await DeNFTInstance.approve(account1.address, 1);
      let get = await approval.wait();
      let own, approve, token;

      get.events?.filter((x) => {
        if (x.event == "Approval") {
          let log = x;
          own = log.args.owner;
          approve = log.args.approved;
          token = log.args.tokenID;
        }
      });

      expect(own).to.equals(owner.address);
      expect(approve).to.equals(account1.address);
      expect(token).to.equals(1);
      expect(await DeNFTInstance.ownerOf(1)).to.equals(owner.address);
      expect(await DeNFTInstance.getApproved(1)).to.equals(account1.address);

    });
  });

  describe("set approver for all NFT testing", () => {
    it('can set approver for all NFT which have owner', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      let tx2 = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt2 = await tx2.wait();
      receipt2.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      let approval = await DeNFTInstance.setApprovalForAll(account1.address, true);
      let get = await approval.wait();
      let own, approve, token;

      get.events?.filter((x) => {
        if (x.event == "ApprovalForAll") {
          let log = x;
          own = log.args.owner;
          approve = log.args.operator;
          token = log.args.approved;
        }
      });

      expect(own).to.equals(owner.address);
      expect(approve).to.equals(account1.address);
      expect(token).to.equals(true);
      expect(await DeNFTInstance.isApprovedForAll(owner.address, account1.address)).to.equals(true);

    });

  });

  describe("Transfer through approval testing", () => {
    it('can transfer without ownership', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      await DeNFTInstance.approve(account1.address, 1);
      await expect(DeNFTInstance.transferFrom(account1.address, account2.address, 1)).to.be.revertedWith('Owner dont have access to this tokenID');

    });

    it('can transfer without approval', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      await DeNFTInstance.approve(account1.address, 1);
      await expect(DeNFTInstance.connect(account2).transferFrom(owner.address, account2.address, 1)).to.be.revertedWith('You cant do this transaction as approver');

    });

    it('can transfer without approval for all NFTs', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      let tx2 = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt2 = await tx2.wait();
      receipt2.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      await DeNFTInstance.setApprovalForAll(account1.address, 1);
      await expect(DeNFTInstance.connect(account2).transferFrom(owner.address, account2.address, 1)).to.be.revertedWith('You cant do this transaction as approver');

    });

    it('can transfer with approval', async () => {
      let tokens;
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      await DeNFTInstance.approve(account1.address, 1);
      let transaction = await DeNFTInstance.connect(account1).transferFrom(owner.address, account2.address, 1);
      let get = await transaction.wait();
      let from, to, token;

      get.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          from = log.args.from;
          to = log.args.to;
          token = log.args.tokenID;
        }
      });

      expect(from).to.equals(owner.address);
      expect(to).to.equals(account2.address);
      expect(token).to.equals(1);
      expect(await DeNFTInstance.balanceOf(owner.address)).to.equals(0);
      expect(await DeNFTInstance.balanceOf(account2.address)).to.equals(1);
      expect(await DeNFTInstance.ownerOf(1)).to.equals(account2.address);

    });

    it('can transfer with approval for all', async () => {
      let tx = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt = await tx.wait();
      receipt.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      let tx2 = await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      let receipt2 = await tx2.wait();
      receipt2.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          tokens = log.args.tokenID;
          //console.log("\nYour NFT is created successfully and your NFT token ID is - ", Number(tokens));
        }
      });

      await DeNFTInstance.setApprovalForAll(account1.address, true);
      let transaction = await DeNFTInstance.connect(account1).transferFrom(owner.address, account2.address, 1);
      let get = await transaction.wait();
      let from, to, token;

      get.events?.filter((x) => {
        if (x.event == "Transfer") {
          let log = x;
          from = log.args.from;
          to = log.args.to;
          token = log.args.tokenID;
        }
      });

      expect(from).to.equals(owner.address);
      expect(to).to.equals(account2.address);
      expect(token).to.equals(1);
      expect(await DeNFTInstance.balanceOf(owner.address)).to.equals(1);
      expect(await DeNFTInstance.balanceOf(account2.address)).to.equals(1);
      expect(await DeNFTInstance.ownerOf(1)).to.equals(account2.address);

    });
  });

  describe("test reward", () => {
    it('can NFT holders get rewards', async () => {
      let RewardDNFT = await ethers.getContractFactory('RewardDNFT');
      let RewardDNFTInstance = await RewardDNFT.deploy(DeNFTInstance.address);

      await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      await hre.ethers.provider.send('evm_increaseTime', [8 * 24 * 60 * 60]);
      let tx = await DeNFTInstance.reward(RewardDNFTInstance.address);
      let get = await tx.wait();
      let from, balance;

      get.events?.filter((x) => {
        if (x.event == "GetRewards") {
          let log = x;
          from = log.args.account,
            balance = log.args.balance
        }
      });

      expect(from).to.equals(owner.address);
      expect(Number(balance)).to.equals(Number(10 * (10 ** 18)));
    });

    it('can multiple NFT holders get rewards', async () => {
      let RewardDNFT = await ethers.getContractFactory('RewardDNFT');
      let RewardDNFTInstance = await RewardDNFT.deploy(DeNFTInstance.address);

      await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });
      await DeNFTInstance.connect(account1).mint({ value: ethers.utils.parseEther("0.1") });
      await DeNFTInstance.connect(account2).mint({ value: ethers.utils.parseEther("0.1") });

      await hre.ethers.provider.send('evm_increaseTime', [8 * 24 * 60 * 60]);
      let tx = await DeNFTInstance.reward(RewardDNFTInstance.address);
      let get = await tx.wait();
      let from, balance;

      get.events?.filter((x) => {
        if (x.event == "GetRewards") {
          let log = x;
          from = log.args.account,
            balance = log.args.balance
        }
      });

      expect(from).to.equals(account2.address);
      expect(Number(balance)).to.equals(Number(10 * (10 ** 18)));
    });

    it('can NFT holders get rewards without any NFT buy by anyone', async () => {
      let RewardDNFT = await ethers.getContractFactory('RewardDNFT');
      let RewardDNFTInstance = await RewardDNFT.deploy(DeNFTInstance.address);

      await hre.ethers.provider.send('evm_increaseTime', [8 * 24 * 60 * 60]);
      await expect(DeNFTInstance.reward(RewardDNFTInstance.address)).to.be.revertedWith('No one has an NFT');
    });

    it('can reward get if 7 days are not completed', async () => {
      let RewardDNFT = await ethers.getContractFactory('RewardDNFT');
      let RewardDNFTInstance = await RewardDNFT.deploy(DeNFTInstance.address);

      await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });
      await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });

      await expect(DeNFTInstance.reward(RewardDNFTInstance.address)).to.be.revertedWith('You cant do this operation now');
    });
  });

  describe('market place testing', () => {
    it('if sell function call token id added into the sellable token id', async () => {
      const MarketPlaceTokens = await ethers.getContractFactory('MarketPlaceTokens');
      const marketPlaceInstance = await MarketPlaceTokens.deploy();

      await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });
      await DeNFTInstance.sellNFT(1, 1, marketPlaceInstance.address);
      const sellTokens = await DeNFTInstance.sellableTokens(marketPlaceInstance.address);

      expect(Number(sellTokens)).to.equals(1);
    });
    it('if dont have access of that token', async () => {
      const MarketPlaceTokens = await ethers.getContractFactory('MarketPlaceTokens');
      const marketPlaceInstance = await MarketPlaceTokens.deploy();

      await DeNFTInstance.mint({ value: ethers.utils.parseEther("0.1") });
      await expect(DeNFTInstance.connect(account1).sellNFT(1, 1, marketPlaceInstance.address)).to.be.revertedWith('You dont have an accesss for this token');
    });
  });
});
