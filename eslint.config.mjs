import ts from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import checkFile from 'eslint-plugin-check-file';
import prettier from 'eslint-config-prettier';
import n from 'eslint-plugin-n';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      globals: {
        "console": "readonly",
        "process": "readonly",
        "setTimeout": "readonly",
        "describe": "readonly",
        "it": "readonly",
        "expect": "readonly"
      },
      ecmaVersion: 'latest', // Use the latest ECMAScript version
      sourceType: 'module', //
    },
    plugins: {
      '@typescript-eslint': ts,
      'check-file': checkFile,
      'prettier': prettier,
      'n': n,
    },
    rules: {
      // Add your custom rules here
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      "semi": ["error"],
      "quotes": ["error", "double"],
      "n/no-process-env": ["warn"],
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
          "**/*.test.ts": "CAMEL_CASE",
          "**/*.tests.ts": "CAMEL_CASE"
        },
      ],
      "check-file/folder-naming-convention": "off",
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none', // Ignore unused function parameters
          varsIgnorePattern: '^_', // Ignore variables prefixed with an underscore
        },
      ],
    },
  },
];