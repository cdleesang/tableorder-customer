const sassResourcesLoader = require('craco-sass-resources-loader');
const path = require('path');

module.exports = {
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
    }
  }
};