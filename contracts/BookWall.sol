// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4; 
//The solidity version I am using, make sure its the same as the one in hardhat.congif.js


import "hardhat/console.sol";
//hardhat allows us to do console.logs in our contract by importing this


contract BookWall {
    uint256 totalBooks;
    //variable initialized to 0 called state variable
    //this is special since it will be stored permanently in contract storage

    //this var is for the fake random number
    uint256 private seed;

    /*
     Event is an inheritable member of a contract. An event is emitted, it stores the arguments passed in transaction logs. 
     These logs are stored on blockchain and are accessible using address of the contract till the contract is present on the blockchain.
     */
    event NewBook(address indexed from, uint256 timestamp, string message);

     /*
     * I created a struct here named Wave.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Book {
        address recommender; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the book recomendations I get
     */
    Book[] books;

    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user sent a reccomendayion.
     */
    mapping(address => uint256) public lastRecommended;

    //The payable keyword allows our contract to pay to other accounts
    constructor() payable {
        console.log("Book reccomendation contract");


        //The initial seed that will be used for the random winner.
        seed = (block.timestamp + block.difficulty) % 100;
    }



    function book(string memory _message) public {
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastRecommended[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastRecommended[msg.sender] = block.timestamp;

        totalBooks += 1;
        console.log("%s has recommended a book!", msg.sender, _message);
        //msg.sender stands for the wallet address of the person who called the function
        //brings cool possibilities like making it so that only certain wallets can do smt


        /*
         * This is where I actually store the wave data in the array.
         */
        books.push(Book(msg.sender, _message, block.timestamp));

        //generate a different seed for the next user that recommends a book
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated : %d", seed );

        //10% chance that the user wins a price
        if (seed < 10) {
            console.log("%s won!", msg.sender);

             //Initiate prize amount
            uint256 prizeAmount = 0.00001 ether;

            //
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than what the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}(""); //Here is where the money is sent
            require(success, "Failed to withdraw money from contract."); // Check if transaccion worked

        }

        
        emit NewBook(msg.sender, block.timestamp, _message);

    }
    //This is how you write a function in Solidity

     /*
     getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllBooks() public view returns (Book[] memory) {
        return books;
    }




    function getTotalBooks() public view returns (uint256) {
        console.log("There are %d book recommendations", totalBooks);
        return totalBooks;
    }

    //IMPORTANT - bECAUSE of te public keyword our functions are available to be called on the blockchain
}
//Smart Contracts look like a class

//From here jump to run.js

//Whenever you cange a contract you want to test it so go to run.js and try the new functions you just added