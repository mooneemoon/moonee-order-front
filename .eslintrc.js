module.exports = {
  extends: [
    '@bucketplace/eslint-config-bucketplace',
    '@bucketplace/eslint-config-bucketplace/react',
    '@bucketplace/eslint-config-bucketplace/typescript',
  ],
  rules: {
    'node/no-unpublished-import': 'off',
  },
  ignorePatterns: [
    'craco.config.ts',
  ],
};

