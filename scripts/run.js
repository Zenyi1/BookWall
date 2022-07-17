//to run a smart contract you need to compile, deploy and execute. This script will make it easier

const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    //You need a wallet address to deploy something. hardhat does it auto but I just grabbed it, also one of a random person


    const bookContractFactory = await hre.ethers.getContractFactory("BookWall");
    //This will compile our contract and generate the necessary files under the artifacts directory.


    const bookContract = await bookContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"), //adding ether to my contract
    });
    //Hardhat creates a local Ethereum network, just for the contract and it is destroyed every time the program ends

    await bookContract.deployed();
    //wait until the contract is deployed to our blockchain which will make our constructor run


    console.log("Contract deploted to:", bookContract.address);
    //once deployed this will give us the address of the deployed contract
    console.log("Contract deployed by:", owner.address);
    //we can see who called the contract out of curiosity

    // get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(
        bookContract.address
    );
    console.log(
        "Contract Balance: ",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let bookCount;
    bookCount = await bookContract.getTotalBooks();

    //Send a rec
    let bookTxn = await bookContract.book("Don Quixote");
    await bookTxn.wait();

    const bookTxn2 = await bookContract.book("Les Miserables");
    await bookTxn2 .wait();

    /*
    * Get Contract balance to see what happened!
    */
    contractBalance = await hre.ethers.provider.getBalance(bookContract.address);
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    bookCount = await bookContract.getTotalBooks();
    console.log(bookCount);

    //Here we basically call our functions like in a normal APY
    //First I call the totalBooks function then I add a new book and lastly I call it again to see it change
    //then we used the random person to simmulate other wallets interacting with our code

};

const runMain = async () => {
    try {
        await main();
        process.exit(0); //exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); //exit Node process while indicating 'Uncaught Exception' error
    }
};

runMain();


//to run this we use npx hardhat run scripts/run.js
//In this case this is our contract address 0x5FbDB2315678afecb367f032d93F642f64180aa3

//run npx hardhat node to create an actual blockchain that wont be killed every instance we close run.js
//This is just an empty blockchain tho