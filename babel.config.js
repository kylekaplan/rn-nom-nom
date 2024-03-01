const path = require('path')
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      // 'module:@react-native/babel-preset'
    ],
    // plugins: ['@babel/plugin-proposal-export-namespace-from'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            // For development, we want to alias the library to the source
            'xmtp-react-native-sdk': path.join(
              __dirname,
              '..',
              'xmtp-react-native',
              'src',
              'index.ts'
            ),
          },
        },
      ],
      '@babel/plugin-proposal-export-namespace-from',
    ],
  };
};
