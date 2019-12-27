const SHA256 = require("crypto-js/sha256");

class Block{
    constructor (index, timestamp, data, previoushHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushHash = previoushHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        //Use SHA256 cryptographic function for generating Hash
        return SHA256(this.index+this.timestamp+this.previoushHash+JSON.stringify(this.data)+this.nonce).toString();
    }

    mineNewBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("A new block was mined with hash ", this.hash);
    }
}

class BlockChain{
    constructor(){
        //first valiable inside the array will be genesis block
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock () {
        return new Block(0, "01/01/2019", "This is a genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previoushHash = this.getLatestBlock().hash;
        //Replace hash function with mine function  newBlock.hash = newBlock.calculateHash();
        newBlock.mineNewBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    checkBlockChainValid(){
        //skip genesis block
        for (let i=1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previoushHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }


}

// creating two new blocks
let block1 = new Block(1,"02/01/2019",{mybalance : 100});
let block2 = new Block(2,"03/01/2019",{mybalance : 50});

// creating new block chain
let myBlockChain = new BlockChain();

// adding new the blocks to block chain
myBlockChain.addBlock(block1);
myBlockChain.addBlock(block2);

console.log(JSON.stringify(myBlockChain, null, 4));
console.log("validation check for the BlockChain: "+myBlockChain.checkBlockChainValid());

// myBlockChain.chain[1].data = {mybalance: 5000};
// console.log("validation check for the BlockChain: "+myBlockChain.checkBlockChainValid());
