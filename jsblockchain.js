const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor (timestamp, transactions, previoushHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushHash = previoushHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        //Use SHA256 cryptographic function for generating Hash
        return SHA256(this.timestamp+this.previoushHash+JSON.stringify(this.transactions)+this.nonce).toString();
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
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    createGenesisBlock () {
        return new Block("01/01/2019", "This is a genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("mined successfully");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress,this.miningReward)
        ];
    }

    addBlock(newBlock){
        newBlock.previoushHash = this.getLatestBlock().hash;
        //Replace hash function with mine function  newBlock.hash = newBlock.calculateHash();
        newBlock.mineNewBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    createTransation(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        // this.chain.forEach(block => {
        for(const block of this.chain){
            // block.transactions.forEach(trans => {
            for(const trans of block.transactions){
                if (trans.fromAddress === address) {
                    balance = balance - trans.amount;
                }
                if (trans.toAddress === address) {
                    balance = balance + trans.amount;
                }
            }
            // });
        }
        // });
        return balance;
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

let bitcoin = new BlockChain();

transaction1 = new Transaction("Tom", "Jerry", 100);
bitcoin.createTransation(transaction1);

transaction2 = new Transaction("Jerry", "Tom", 30);
bitcoin.createTransation(transaction2);

console.log("Stating mining for pending transactions");
bitcoin.minePendingTransactions("Donald");


console.log("bitcoin: "+JSON.stringify(bitcoin));

console.log("Balance for Tom is "+bitcoin.getBalanceOfAddress("Tom"));
console.log("Balance for Jerry is "+bitcoin.getBalanceOfAddress("Jerry"));
console.log("Balance for Donald is "+bitcoin.getBalanceOfAddress("Donald"));

console.log("Starting mining rewarded pending Transaction");

bitcoin.minePendingTransactions("Donald");
console.log("Balance for Donald is "+bitcoin.getBalanceOfAddress("Donald"));