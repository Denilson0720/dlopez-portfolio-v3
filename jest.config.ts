import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^lowlight$': '<rootDir>/__mocks__/lowlight.ts',
    '^lowlight/(.*)$': '<rootDir>/__mocks__/lowlight.ts',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(lowlight|highlight\\.js|@tiptap/extension-code-block-lowlight)/)',
  ],
}

export default createJestConfig(config)
