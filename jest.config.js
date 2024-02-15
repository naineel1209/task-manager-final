export default {
    testEnvironment: "node",
    testMatch: ["**/**/*.test.js", "**/**/*.test.mjs"],
    verbose: true,
    forceExit: true,
    transform: {
        "^.+\\.js$": "babel-jest",
        "^.+\\.mjs$": "babel-jest"
    },
    // clearMocks: true,
    // resetMocks: true,
    // restoreMocks: true,
    // clearMocks: true,
}