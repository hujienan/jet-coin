//require sha256 hash function
const SHA256 = require("crypto-js/sha256")
//Block class
class Block {
    constructor(timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash
        this.timestamp = timestamp
        this.transactions = transactions
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash(){
        return SHA256( 
            this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.transactions) + 
            this.nonce    
        ).toString()
    }
    //mine
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++
            this.hash = this.calculateHash()
        }
        console.log("BLOCK MINED:" + this.hash)
    }
}

class Transaction{
    //sender receiver amount
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}
//Blockchain class
class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 5
        //store transactions
        this.pendingTransactions = []
        //reward coins
        this.miningReward = 100
    }
    createGenesisBlock(){
        return new Block('17/05/2018', 'Genesis block', '0')
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }
    createTransaction(transaction){
        //some validation
        //push
        this.pendingTransactions.push(transaction)
    }

    minePendingTransactions(miningRewardAddress){ 
        //create new block with all pending transactions and mine it
        let block = new Block(Date.now(), this.pendingTransactions)
        block.mineBlock(this.difficulty)
        //add the newly mined block to the chain
        this.chain.push(block)
        //reset peding transactions and send mining reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    getBalanceOfAddress(address){
        let balance = 0
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount
                }
                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }
        return balance
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i-1]
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false
            }
        }
        return true
    }
}
//using the blockchain
let JienanCoin = new Blockchain()
console.log('Creating some transactions...')
JienanCoin.createTransaction(new Transaction('address1', 'address2', 100))
JienanCoin.createTransaction(new Transaction('address2', 'address1', 50))
console.log('Starting the miner...')
JienanCoin.minePendingTransactions('jienan-address')
console.log('Balance of Jienan address is', JienanCoin.getBalanceOfAddress('jienan-address'))
console.log('Starting the miner again!');
JienanCoin.minePendingTransactions("jienan-address")
console.log('Balance of Jienan address is', JienanCoin.getBalanceOfAddress('jienan-address'))
