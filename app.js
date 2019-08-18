const cmgtminer = require('./cmgtminer');

const miner = async () => {
    await(cmgtminer.mine())
}

miner()