const main = async () => {
    const bookContractFactory = await hre.ethers.getContractFactory("BookWall");
    const bookContract = await bookContractFactory.deploy();
    await bookContract.deployed();
    console.log("Contract addy:", bookContract.address);
  
    let bookCount;
    bookCount = await bookContract.getTotalBooks();
    console.log(bookCount.toNumber());
  
    /**
     * Let's send a few waves!
     */
    let bookTxn = await bookContract.book("A message!");
    await bookTxn.wait(); // Wait for the transaction to be mined
  
    const [_, randomPerson] = await hre.ethers.getSigners();
    bookTxn = await bookContract.connect(randomPerson).book("Another message!");
    await bookTxn.wait(); // Wait for the transaction to be mined
  
    let allBooks = await bookContract.getAllBooks();
    console.log(allBooks);
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

  //npx hardhat run scripts/run2.js.