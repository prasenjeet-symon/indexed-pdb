
module.exports = {
    preset: "jest-puppeteer",
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testRegex: '/src/tests/.*\\.spec?\\.ts$',
    moduleFileExtensions: ['ts', 'js'],
};