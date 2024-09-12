import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
  },
  {
    rules: {
      'react/prefer-destructuring-assignment': ['off'],
      'unused-imports/no-unused-imports': [
        'error',
        { varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['packages/ui/src/**/*.{tsx,jsx}'],
    rules: {
      'react/no-unstable-context-value': ['off'],
      'react-dom/no-missing-button-type': ['off'],
      'react/no-unstable-default-props': ['off'],
      'react/no-array-index-key': ['off'],
      'react-refresh/only-export-components': ['off'],
    },
  },
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          name: '@ts-rest/serverless/fetch',
          importNames: ['tsr'],
          message: 'Please import `tsr` from predefined package scope instead.',
        },
      ],
    },
  },
)
