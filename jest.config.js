/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  maxWorkers: 4,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
      "src/**/*.ts",
      "!src/**/*.d.ts"
  ],
  coverageReporters: [
      "json",
      "text-summary",
      "html",
  ]
};