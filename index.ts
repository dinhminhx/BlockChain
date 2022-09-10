const hash = require('crypto-js/sha256');

class Transaction{
    private fromAddress:any;
    private toAddress:any;
    private amount:number;
    constructor(fromAddress:string, toAddress:string,amount:number){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    public prevHash: string;
    private transaction:any;
    private timeStamp:any;
    public hash:string;
    private countMine:number;
    constructor(prevHash: any,transaction: any) {
        this.prevHash = prevHash;
        this.transaction = transaction;
        this.timeStamp = new Date();
        this.hash = this.renderHash();
        this.countMine = 0;
    }
    renderHash() {
        return hash(this.prevHash + JSON.stringify(this.transaction) + this.timeStamp + this.countMine ).toString();
    }

    mine(difficulty:any):string {
        while(!this.hash.startsWith(difficulty.toString())){
            this.hash = this.renderHash()
            this.countMine++;
        }
        return this.hash;
    }

}
class BlockChain {
    public chain:any ;
    public difficulty:any;
    public pendingTransactions:any;
    public miningReward:number;
    constructor(difficulty:any){
        const genesisBlock = new Block('Ming',{ message: 'firstBlock' });
        this.chain = [genesisBlock];
        this.difficulty = difficulty;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    getLastBlock():Block {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(data:any): void{
    //     const lastBlock = this.getLastBlock();
    //     const newBlock = new Block(lastBlock.hash, data);
    //     console.log('Start Mining');
    //     newBlock.mine(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress:any){
        let block = new Block('',this.pendingTransactions);
        block.mine(this.difficulty);
        console.log('Mined Successfully!\n');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null,miningRewardAddress,this.miningReward)
        ];
    }

    createTransaction(transaction:any){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address:any){
        let balance = 0;
        for (const block of this.chain){
            for(const trans of block.transaction){
                if(trans.fromAddress === address){
                    balance-=trans.amount;
                } 
                if(trans.toAddress === address){
                    balance+=trans.amount;
                } 
            }
        }
        return balance;
    }

    isVerified(difficulty:any): boolean{
        this.difficulty = difficulty;
        for(let i = 1; i < this.chain.length;i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.mine(difficulty)){
                return false;
            }
            if(currentBlock.prevHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}


let difficulty = '0000'
const mingChain = new BlockChain(difficulty);

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

const mingCoin = new BlockChain(difficulty);
mingCoin.createTransaction(new Transaction('MoneyForward','Ming',200));
mingCoin.createTransaction(new Transaction('MoneyForward','Ming',400));

console.log('\n Starting miner');
mingCoin.minePendingTransactions('ming-wallet');
console.log('Balance is ' + mingCoin.getBalanceOfAddress('ming-wallet'));

console.log('\n Starting miner');
mingCoin.minePendingTransactions('ming-wallet');
console.log('Balance is ' + mingCoin.getBalanceOfAddress('ming-wallet'));


