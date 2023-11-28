module.exports = {
  root: true,
  extends: ['@react-native-community', 'eslint:recommended'],
  rules: {
    'no-unused-vars': [
      'error',
      {vars: 'all', args: 'all', ignoreRestSiblings: false},
    ],
    'no-use-before-define': [
      'error',
      {functions: false, classes: false, variables: false},
    ],
  },
};
