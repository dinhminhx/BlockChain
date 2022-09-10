var hash = require('crypto-js/sha256');
var Transaction = /** @class */ (function () {
    function Transaction(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    return Transaction;
}());
var Block = /** @class */ (function () {
    function Block(prevHash, transaction) {
        this.prevHash = prevHash;
        this.transaction = transaction;
        this.timeStamp = new Date();
        this.hash = this.renderHash();
        this.countMine = 0;
    }
    Block.prototype.renderHash = function () {
        return hash(this.prevHash + JSON.stringify(this.transaction) + this.timeStamp + this.countMine).toString();
    };
    Block.prototype.mine = function (difficulty) {
        while (!this.hash.startsWith(difficulty.toString())) {
            this.hash = this.renderHash();
            this.countMine++;
        }
        return this.hash;
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain(difficulty) {
        var genesisBlock = new Block('Ming', { message: 'firstBlock' });
        this.chain = [genesisBlock];
        this.difficulty = difficulty;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    BlockChain.prototype.getLastBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    // addBlock(data:any): void{
    //     const lastBlock = this.getLastBlock();
    //     const newBlock = new Block(lastBlock.hash, data);
    //     console.log('Start Mining');
    //     newBlock.mine(this.difficulty);
    //     this.chain.push(newBlock);
    // }
    BlockChain.prototype.minePendingTransactions = function (miningRewardAddress) {
        var block = new Block('', this.pendingTransactions);
        block.mine(this.difficulty);
        console.log('Mined Successfully!\n');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    };
    BlockChain.prototype.createTransaction = function (transaction) {
        this.pendingTransactions.push(transaction);
    };
    BlockChain.prototype.getBalanceOfAddress = function (address) {
        var balance = 0;
        for (var _i = 0, _a = this.chain; _i < _a.length; _i++) {
            var block = _a[_i];
            for (var _b = 0, _c = block.transaction; _b < _c.length; _b++) {
                var trans = _c[_b];
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    };
    BlockChain.prototype.isVerified = function (difficulty) {
        this.difficulty = difficulty;
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var prevBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.mine(difficulty)) {
                return false;
            }
            if (currentBlock.prevHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    };
    return BlockChain;
}());
var difficulty = '0000';
var mingChain = new BlockChain(difficulty);
// mingChain.addBlock({
//     from: 'Money Forward',
//     to: 'Ming',
//     message: 'salary',
//     money: 100000
// })
// mingChain.addBlock({
//     from: 'Money Forward',
//     to: 'Ming',
//     message: 'salary',
//     money: 200000
// })
// mingChain.chain[1].data = {
//     from: 'Money Forward',
//     to: 'Ming',
//     message: 'salary',
//     money: 1000
// }
// console.log(mingChain.chain);
// console.log('Chain is verified : ',mingChain.isVerified());
var mingCoin = new BlockChain(difficulty);
mingCoin.createTransaction(new Transaction('MoneyForward', 'Ming', 200));
mingCoin.createTransaction(new Transaction('MoneyForward', 'Ming', 400));
console.log('\n Starting miner');
mingCoin.minePendingTransactions('ming-wallet');
console.log('Balance is ' + mingCoin.getBalanceOfAddress('ming-wallet'));
console.log('\n Starting miner');
mingCoin.minePendingTransactions('ming-wallet');
console.log('Balance is ' + mingCoin.getBalanceOfAddress('ming-wallet'));
