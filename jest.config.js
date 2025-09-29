const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

const nextJest = require("next/jest");

const createJestConfig = nextJest();

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 6000,
});

module.exports = jestConfig;
