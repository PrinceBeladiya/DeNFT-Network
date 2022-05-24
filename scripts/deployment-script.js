async function main() {
  const [accounts] = await ethers.getSigners();
  console.log("deployed contract with account - ", await accounts.getAddress());

  const DeNFT = await ethers.getContractFactory('DeNFT');
  const deNFT = await DeNFT.deploy();

  const MarketPlace = await ethers.getContractFactory('MarketPlace');
  const marketplace = await MarketPlace.deploy();

  const FractionalERC721Factory = await ethers.getContractFactory('FractionalERC721Factory');
  const fractionFactory = await FractionalERC721Factory.deploy();

  const USDC = await ethers.getContractFactory('USDC');
  const usdc = await USDC.deploy();

  const LendBorrow = await ethers.getContractFactory('LendBorrow');
  const lendBorrow = await LendBorrow.deploy(usdc.address);

  console.log("DeNFT address ==> ", deNFT.address);
  console.log("MarketPlace address ==> ", marketplace.address);
  console.log("FractionalERC721Factory address ==> ", fractionFactory.address);
  console.log("USDC address ==> ", usdc.address);
  console.log("LendBorrow address ==> ", lendBorrow.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
