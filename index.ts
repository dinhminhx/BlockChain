const hash = require('crypto-js/sha256');

class Block {
    public prevHash: string;
    private data:any;
    private timeStamp:any;
    public hash:string;
    private countMine:number;
    constructor(a: any,b: any) {
        this.prevHash = a;
        this.data = b;
        this.timeStamp = new Date();
        this.hash = this.renderHash();
        this.countMine = 0;
    }
    renderHash() {
        return hash(this.prevHash + JSON.stringify(this.data) + this.timeStamp + this.countMine ).toString();
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
    constructor(difficulty:any){
        const genesisBlock = new Block('Ming',{ message: 'firstBlock' });
        this.chain = [genesisBlock];
        this.difficulty = difficulty;
    }

    getLastBlock():Block {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data:any): void{
        const lastBlock = this.getLastBlock();
        const newBlock = new Block(lastBlock.hash, data);
        console.log('Start Mining');
        newBlock.mine(this.difficulty);
        this.chain.push(newBlock);
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

mingChain.addBlock({
    from: 'Money Forward',
    to: 'Ming',
    message: 'salary',
    money: 100000
})

mingChain.addBlock({
    from: 'Money Forward',
    to: 'Ming',
    message: 'salary',
    money: 200000
})

console.log(mingChain.chain);
console.log('Chain is verified : ',mingChain.isVerified(difficulty));
console.log('-------------------------------------------- \n');

// mingChain.chain[1].data = {
//     from: 'Money Forward',
//     to: 'Ming',
//     message: 'salary',
//     money: 1000
// }
// console.log(mingChain.chain);
// console.log('Chain is verified : ',mingChain.isVerified());


