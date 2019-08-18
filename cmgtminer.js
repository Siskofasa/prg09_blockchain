const mod10 = require('../cmgt-blockchain-master 2/mod10')
const axios = require('axios')

const cmgtminer = (function(){

    const sleep = time => new Promise(resolve => setTimeout(resolve, time));

    const mine = async () => {
        const { data } = await fetchLastBlock()

        if(! data.open || data.countdown < 20000)
        {
            console.log(`Waiting ${data.countdown} milliseconds for countdown to reset...`)
            await sleep(data.countdown);
            return mine()
        }
        console.log('Mining...')
        console.time("CMGT Coin mined in");

        let hashString = generateHashString(data.blockchain)
        let initialHash = mod10.hash(hashString)
        let newHashString = generateNewHashString(initialHash, data)

        let nonce = await generateNonce(newHashString, 0)

        console.timeEnd("CMGT Coin mined in");

        const res = await postNonce(nonce);

        if(res.data.message === "nonce correct, but not valid anymore. timestamp has changed (1 timesteps)")
        {
            console.log(res.data.message)
            await sleep(1000)
            return await mine()
        }

        if(res.data.message === "blockchain accepted, user awarded")
        {
            console.log(`Posted solution with nonce ${nonce}`, res.data.message);
            console.log("Starting again in 5 seconds...")
            await sleep(5000)
            return await mine()
        }

        console.log('Unrecognized message...', res.data)
        return await mine()
    }

    const generateHashString = (blockchain) => {
        let hashString = new Array();

        hashString.push(blockchain.hash)
        hashString.push(blockchain.data[0].from)
        hashString.push(blockchain.data[0].to)
        hashString.push(blockchain.data[0].amount)
        hashString.push(blockchain.data[0].timestamp)
        hashString.push(blockchain.timestamp)
        hashString.push(blockchain.nonce)

        return hashString.join('')
    }

    const generateNewHashString = (initialHash, block) => {
        let hashString = new Array();
        const transaction = block.transactions[0]
        const timestamp = block.timestamp

        hashString.push(initialHash)
        hashString.push(transaction.from)
        hashString.push(transaction.to)
        hashString.push(transaction.amount)
        hashString.push(transaction.timestamp)
        hashString.push(timestamp)

        return hashString.join('')
    }

    const fetchLastBlock = () => axios.get("http://programmeren9.cmgt.hr.nl:8000/api/blockchain/next")

    const generateNonce = async (string, nonce, timer = 3000) => {

        let hash = mod10.hash(`${string}${nonce}`)

        if(hash.startsWith('0000')) {
            return nonce
        }else{
            // console.log(`Failed for ${nonce} with ${hash}`)
            let time = timer - 1;

            if (time === 0) {
            
              time = 3000;
              await sleep(10);
            }

            return generateNonce(string, (nonce + 1), time)
        }
    }

    const postNonce = (nonce) => axios.post(
      "http://programmeren9.cmgt.hr.nl:8000/api/blockchain",
      {
        nonce: nonce.toString(),
        user: "Anton 0849851",
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    return {
        mine
    }
})()

module.exports = cmgtminer