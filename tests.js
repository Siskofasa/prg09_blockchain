var expect = require('chai').expect
var mod10 = require('./mod10')

let verbose = false

describe('Functions', function() {
    describe('Convert string to array', function(){
        it('should strip whitespace from string', function() {
            let input = "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8CMGT Mining CorporationBob PIKAB11548689513858154874778871610312"
            let solution = "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8CMGTMiningCorporationBobPIKAB11548689513858154874778871610312"

            expect(mod10.stripWhitespace(input, verbose)).equal(solution)
        });

        it('should convert text to unicode array', function() {
            let str = "text"
            let solution = [ 116, 101, 120, 116 ]

            expect(mod10.convertStringToCharArray(str, verbose)).to.deep.equal(solution)
        });

        it('should split unicode array to separate numbers', function() {
            let str = [ 116, 101, 120, 116 ]
            let solution = [ 1, 1, 6, 1, 0, 1, 1, 2, 0, 1, 1, 6 ]

            expect(mod10.splitArrayToChars(str, verbose)).to.deep.equal(solution)
        });
    })
    

    describe('Chunking', function() {
        it('should chunk the chararray into chunks of 10', function(){
            let entry = [ 1, 1, 6, 1, 0, 1, 1, 2, 0, 1, 1, 6 ]
            let solution = [
                [ 1, 1, 6, 1, 0, 1, 1, 2, 0, 1],
                [ 1, 6]
            ]

            expect(mod10.chunkArray(entry, 10, verbose)).to.deep.equal(solution)
        })

        it('should fill the chunk with numbers up till 10', function(){
            let entry = [1, 6]
            let solution = [1, 6, 0, 1, 2, 3, 4, 5, 6, 7]

            expect(mod10.fillChunk(entry, verbose)).to.deep.equal(solution)
        })

        it('should chunk the array and fill with numbers up till 10', function(){
            let entry = [ 1, 1, 6, 1, 0, 1, 1, 2, 0, 1, 1, 6 ]
            let solution = [ 
                [ 1, 1, 6, 1, 0, 1, 1, 2, 0, 1 ],
                [ 1, 6, 0, 1, 2, 3, 4, 5, 6, 7 ] 
            ]
 
            expect(mod10.chunkAndFill(entry, verbose)).to.deep.equal(solution)
        })
    });

    describe('Sequencing', function(){
        it('should generate an array with 10 values', function(){
            let entry = [ 
                [ 1, 1, 6, 1, 0, 1, 1, 2, 0, 1 ],
                [ 1, 6, 0, 1, 2, 3, 4, 5, 6, 7 ] 
            ]
            let solution = [
             2, 7, 6, 2, 2, 4, 5, 7, 6, 8  
            ]

            expect(mod10.calcNewBlocks(entry)).to.deep.equal(solution)
        })
    })  
});

describe('Hashing', function(){
    it('should generate a correct hash', function(){
        let entry = "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8CMGT Mining CorporationBob PIKAB11548689513858154874778871610312"
        let solution = "00005d430ce77ad654b5309a770350bfb4cf49171c682330a2eccc98fd8853cf"

        expect(mod10.hash(entry, verbose)).equal(solution)
    })
})



// describe('Mining', function() {
//     it('should generate hash from text', function() {
//         let entry = "text"
//         let solution = "d0b3cb0cc9100ef243a1023b2a129d15c28489e387d3f8b687a7299afb4b5079"

//         // expect(mod10.decrypt(entry)).to.equal(solution)
//     });
// });

