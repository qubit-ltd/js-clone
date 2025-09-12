////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import qubitConfig from '@qubit-ltd/eslint-config';

export default [
  ...qubitConfig,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        Event: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
        FileReader: 'readonly',
        setTimeout: 'readonly',
        // Node.js globals
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'max-classes-per-file': 'off', // Allow multiple classes in test files
    },
  },
];
