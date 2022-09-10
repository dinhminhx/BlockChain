var hash = require('crypto-js/sha256');
var Block = /** @class */ (function () {
    function Block(a, b) {
        this.prevHash = a;
        this.data = b;
        this.timeStamp = new Date();
        this.hash = this.renderHash();
        this.countMine = 0;
    }
    Block.prototype.renderHash = function () {
        return hash(this.prevHash + JSON.stringify(this.data) + this.timeStamp + this.countMine).toString();
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
    }
    BlockChain.prototype.getLastBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    BlockChain.prototype.addBlock = function (data) {
        var lastBlock = this.getLastBlock();
        var newBlock = new Block(lastBlock.hash, data);
        console.log('Start Mining');
        newBlock.mine(this.difficulty);
        this.chain.push(newBlock);
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
mingChain.addBlock({
    from: 'Money Forward',
    to: 'Ming',
    message: 'salary',
    money: 100000
});
mingChain.addBlock({
    from: 'Money Forward',
    to: 'Ming',
    message: 'salary',
    money: 200000
});
console.log(mingChain.chain);
console.log('Chain is verified : ', mingChain.isVerified(difficulty));
console.log('-------------------------------------------- \n');
// mingChain.chain[1].data = {
//     from: 'Money Forward',
//     to: 'Ming',
//     message: 'salary',
//     money: 1000
// }
// console.log(mingChain.chain);
// console.log('Chain is verified : ',mingChain.isVerified());
