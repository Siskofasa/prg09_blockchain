const sha256 = require('js-sha256').sha256

const mod10 = (function () {

    const hash = (input, verbose = false) => {
        let hash

        hash = stripWhitespace(input, verbose)

        hash = convertStringToCharArray(hash, verbose)

        hash = splitArrayToChars(hash, verbose)

        hash = chunkAndFill(hash, verbose)

        hash = calcNewBlocks(hash, verbose)

        hash = applyHash(hash, verbose)

        return hash
    }

    // Strip whitespace with RegExp
    const stripWhitespace = (str, verbose = false) => {        
        if(verbose) console.log('Removing spaces...')

        str = str.replace(/\s+/g, '')
        if(verbose) console.log(str)

        return str
    }

    // Create an array from string and map this
    // If it is not a number, convert to charCode
    const convertStringToCharArray = (input, verbose = false) => {
        if(verbose) console.log('Converting String to Unicode Array...')

        let charArray = Array.from(input).map((value, index) => {
            
            return isNaN(value)
                ? value.charCodeAt(0)
                : value
        })

        if(verbose) console.log(charArray)

        return charArray
    }   

    // Split the the nummbers into seperate integers
    const splitArrayToChars = (array, verbose = false) => {
        if(verbose) console.log('Splitting unicode into seperate characters...')
        let splitArray = new Array()
        
        array.forEach((value, index) => {
            // Convert int to string and loop over string characters
            Array.from(value.toString()).forEach((char) => {
                splitArray.push(parseInt(char))
            })
        })

        if(verbose) console.log(splitArray)

        return splitArray
    }

    // First chunk the array and fill with remaining stuff
    const chunkAndFill = (array, verbose = false) => {
        chunks = chunkArray(array, 10, verbose)
        if(verbose) console.log('Unfilled array \n', chunks)

        if(chunks[chunks.length - 1].length !== 10) {
            chunks[chunks.length - 1] = fillChunk(chunks[chunks.length - 1], verbose)
        }


        if(verbose) console.log('Filled array \n', chunks)

        return chunks
    }

    /*
    1. First Slice 10 numbers from the array
    2. Concat the same function call but without the first elements of the array
    3. Repeat process
    4. This will eventually bubble up to chunked arrays as it returns itself to previous stack
    */
    const chunkArray = (array, size, verbose = false) => {
        if(verbose) console.log('Chunking array... \n', array)
        
        if (!array) {
            return []
        }
        
        // Slic the top of the array (0 - 10)
        const firstChunk = array.slice(0, size)

        // If there is not firstchunk return an empty array.
        if (!firstChunk.length) {
            return array
        }

        if(verbose) console.log('Chunked: \n', firstChunk)

        return [firstChunk].concat(chunkArray(array.slice(size, array.length), size, verbose))
    }

    const fillChunk = (chunk, verbose = false) => {
        if (verbose) console.log("Filling last chunk...")
        n = 0

        // fill the chunk with data if its length is not 10
        for(i = chunk.length; i < 10; i++) {
            chunk.push(n)
            n++
        }

        if(verbose) console.log(chunk)

        return chunk
    }

    const calcNewBlocks = (chunks = [], summed = [], verbose = false) => {
        if(verbose) console.log('CalcNewBlocks...')
        
        // If no more chunks, all chunks were summed
        if (! chunks.length) return [...summed]

        // if not summed, shift first element of the chunks to act as summed
        if (! summed.length) {

            if (chunks.length === 1) return chunks

            summed = [...chunks.shift()]
        }

        // the next sequence is the first element in the array
        let nextSequence = [...chunks.shift()]

        // Zip the summed and nextsequence to from a new summed array
        const added = summed.map(function(value, i){
            return ((parseInt(value, 10) + parseInt(nextSequence[i], 10)) % 10)
        })

        // the array past into the recursion is the shifted chunks and the new summed number array
        return calcNewBlocks(chunks, added)
    }

    const applyHash = (array, verbose = false) => {
        if(verbose) console.log("Flattening array...\n", array)
        
        let string = array.join('')

        if(verbose) console.log("Hashing string...\n", string)

        string = sha256(string)
        if(verbose) console.log(string)

        return string
    }

    return {
        hash,
        stripWhitespace,
        convertStringToCharArray,
        splitArrayToChars,
        chunkAndFill,
        chunkArray,
        fillChunk,
        calcNewBlocks,
        applyHash,
    }

})()

module.exports = mod10