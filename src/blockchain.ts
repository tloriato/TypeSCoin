class Block {

    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;

    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
    }
}

const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

const generateNextBlock = (blockData: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = new Date().getTime() / 100;
    const newHash: string = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    const newBlock: Block = new Block(nextIndex, newHash, previousBlock.hash, nextTimestamp, blockData);
    return newBlock;
};

const calculateBlockHash = (block: Block): string => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

const verifyBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};

const verifyNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    if (previousBlock.index + 1 !== newBlock.index) {
        return false;
    }
    if (newBlock.previousHash !== previousBlock.hash) {
        return false;
    }
    if (newBlock.hash !== calculateBlockHash(newBlock)) {
        return false;
    }
    return true;
};

const verifyBlockChain = (blockchainToVerify: Block[]): boolean => {
    const verifyGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if (!verifyGenesis(blockchainToVerify[0])) {
        return false;
    }

    for (let i = 1; i < blockchainToVerify.length; i++) {
        if (!verifyNewBlock(blockchainToVerify[i], blockchainToVerify[i - 1])) {
            return false;
        }
    }

    return true;
};

const replaceChain = (newBlocks: Block[]) => {
    if (verifyBlockChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        blockchain = newBlocks;
        // broadcastLatest();
    } else {
        // console.log('Received invalid blockchain');
    }
};

const getLatestBlock = (): Block => {
    if (blockchain.length - 1 >= 0) {
        return blockchain[blockchain.length - 1];
    }
};

const getBlockchain = (): Block[] => {
    return blockchain;
};

const genesisBlock: Block = new Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!');

let blockchain: Block[] = [genesisBlock];

