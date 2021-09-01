//This is my first solution how to get transaction data for given address and block.
    //However iterate through blocks this way is very time consuming, For example Etherscan API can get results quickly. I was wondering how is it possible.
    //So I've got this idea: create app or smart contract that would get all current events on blockchain and index it. Then we can access these indexed data quickly
    //disadvatange would be however that we could get data only from the point of time when we started to index.

const Web3 = require("web3");
const EthDater = require("ethereum-block-by-date");

class Crawler {
    web3;
    dater;
    addressToFind;
    startBlockNumber;

    constructor(addressToFind, startBlockNumber) {
        this.web3 = new Web3(new Web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/b33d075c68296226f59db57b/eth/mainnet/archive"));
        this.dater = new EthDater(this.web3);
        this.addressToFind = addressToFind.toLowerCase();
        this.startBlockNumber = startBlockNumber;
    }

    async crawlerFunction() {

    //how to find transactions for address
        //set latest block
        let latestBlock = await this.web3.eth.getBlock("latest");
        let latestBlockNumber = latestBlock.number;
        //iterate blocks
        for (let blockNumber = this.startBlockNumber; blockNumber <= latestBlockNumber; blockNumber++) {
            let currentBlock = await this.web3.eth.getBlock(blockNumber);
            //iterate transactions of blocks
            for (let txHash of currentBlock.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                //if we find corresponding address, we display transaction data
                if (this.addressToFind == (tx.to?tx.to:"").toLowerCase() || this.addressToFind == (tx.from?tx.from:"").toLowerCase()) {
                    // console.log({addressFrom: tx.from.toLowerCase(), addressTo: tx.to.toLowerCase(), value: this.web3.utils.fromWei(tx.value, "ether"), gas: tx.gas, tx: tx});
                    console.log("Address from: "+tx.from.toLowerCase());
                    console.log("Address to: "+tx.to.toLowerCase());
                    console.log("ETH used for transaction: "+(tx.gas*tx.gasPrice/1000000000000000000));
                }
            }
            //set latest block again in case new blocks are generated meanwhile
            latestBlock = await this.web3.eth.getBlock("latest");
            latestBlockNumber = latestBlock.number;
        }
    }
}
let crawler = new Crawler("0xDc18e1f94EB8CA06455216BdBB1F6b64C1081881", "13141287");
crawler.crawlerFunction();
