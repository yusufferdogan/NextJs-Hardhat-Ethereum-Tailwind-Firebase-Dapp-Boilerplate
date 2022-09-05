module.exports = {
  parser: 'babel-eslint',
  extends: ['react-app', 'prettier', 'prettier/flowtype', 'prettier/react'],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: false,
    es2021: true,
    node: true,
  },

  plugins: ['flowtype', 'react', 'prettier', 'import', 'json', 'promise'],

  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:json/recommended',
    'plugin:promise/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],

  rules: {
    'prettier/prettier': 'warn',
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'sort-vars': ['warn', { ignoreCase: true }],
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],
  },
};
