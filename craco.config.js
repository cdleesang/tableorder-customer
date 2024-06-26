const sassResourcesLoader = require('craco-sass-resources-loader');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function() {
  const isProd = process.env.NODE_ENV === 'production';
  const analyzerMode = process.env.REACT_APP_INTERACTIVE_ANALYZE
    ? 'server'
    : 'json';
  const webpackPlugins = [];

  if(isProd) {
    webpackPlugins.push(new BundleAnalyzerPlugin({analyzerMode}));
  }

  return {
    mode: 'development',
    plugins: [
      {
        plugin: sassResourcesLoader,
        options: {
          resources: './src/assets/styles/*.scss'
        },
      },
    ],
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        paths.appBuild = webpackConfig.output.path = path.resolve('../customer-frontend');
        return webpackConfig;
      },
      plugins: webpackPlugins,
    },
  };
};