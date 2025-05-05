export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['**/tests/**/*.(test|spec).[jt]s?(x)'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  collectCoverage: false,
};