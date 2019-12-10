const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    moduleDirectories: [
        ".",
        "src",
        "node_modules"
    ],
    modulePathIgnorePatterns: ["__tests__/utils"]
};
