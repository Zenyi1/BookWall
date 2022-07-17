const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
    //self explanatory but it grabs the balance of the deployer account

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const bookContractFactory = await hre.ethers.getContractFactory("BookWall");
    const bookContract = await bookContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.05"),
    });
    await bookContract.deployed();

    console.log("BookWall address: ", bookContract.address);
};

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();

//for info on each line check run.js
//first start a node npx harhdat node
//npx hardhat run scripts/deploy.js --network localhost
//npx hardhat run scripts/deploy.js --network rinkeby    This deploys tho the test network

//The next thing is to do an account on Alchemy to actually deploy the blockchain, create one and get the keys

//to deploy it on rinkeby just change localhost from the script above to rinkeby

//Here is the contract address dedployed to rinkeby 0x91B66daC8Ce04F1e63b7cF66dA3581d36215efA5

//Everytime you update your contract we have tp redeploy it again, update the contract address on our frontend, and update the abi file on your frontend