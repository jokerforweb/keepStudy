/**
 * Webpack 配置
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {AureliaPlugin, ModuleDependenciesPlugin} = require('aurelia-webpack-plugin');
const {optimize: {CommonsChunkPlugin}, ProvidePlugin} = require('webpack');

const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || [];
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig);

const title = 'MATHGAMES';
const outDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');
const staticDir = path.resolve(__dirname, 'static');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const mathGamesDir = path.resolve(srcDir, 'math-games');

const cssRules = [
  {loader: 'css-loader'},
  {loader: 'sass-loader'},
  {
    loader: 'postcss-loader',
    options: {plugins: () => [require('autoprefixer')({browsers: ['last 2 versions']})]}
  }
];

const devServer = {
  port: 9000,
  contentBase: outDir,
  historyApiFallback: true
};

const rules = function ({production, server, extractCss, coverage} = {}) {
  return [ //
    {
      test: /\.(css|scss)$/i,
      issuer: [{not: [{test: /\.html$/i}]}],
      use: extractCss ? ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: cssRules
      }) : ['style-loader', ...cssRules],
      exclude: []
    }, {
      test: /\.css$/i,
      issuer: [{test: /\.html$/i}],
      use: cssRules,
      exclude: []
    }, {
      test: /\.(css|scss)$/i,
      loader: 'raw-loader',
      include: []
    }, {test: /\.html$/i, loader: 'html-loader'}, {
      test: /\.js$/i,
      loader: 'babel-loader',
      exclude: nodeModulesDir,
      options: coverage ? {sourceMap: 'inline', plugins: ['istanbul']} : {}
    }, {
      test: /\.json$/i, loader: 'json-loader',
      exclude: staticDir
    },
    {test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/, loader: 'expose-loader?Promise'},
    {
      test: /\.(png|gif|jpg|cur)$/i,
      loader: 'url-loader',
      options: {limit: 8192}
    }, {
      test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
      loader: 'url-loader',
      options: {limit: 10000, mimetype: 'application/font-woff2'}
    }, {
      test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
      loader: 'url-loader',
      options: {limit: 10000, mimetype: 'application/font-woff'}
    },
    {test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader'}
  ];
};

const plugins = function ({template, production, server, extractCss, coverage} = {}) {
  let aureliaPlugin = new AureliaPlugin({
    features: {
      svg: false
    }
  });

  let providerPlugin = new ProvidePlugin({'Promise': 'bluebird'});

  let htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: template.name + '.ejs',
    filename: template.name + '.html',
    minify: production ? {
      removeComments: true,
      collapseWhitespace: true
    } : undefined,
    metadata: {
      title,
      server,
      baseUrl
    }
  });

  let moduleDependenciesPlugin = new ModuleDependenciesPlugin({
    'aurelia-testing': ['./compile-spy', './view-spy'],
    'aurelia-authentication': ['aurelia-authentication/authFilterValueConverter'],
    'aurelia-v-grid': [
      'aurelia-v-grid/grid/attributes/v-filter',
      'aurelia-v-grid/grid/attributes/v-filter-observer',
      'aurelia-v-grid/grid/attributes/v-sort',
      'aurelia-v-grid/grid/attributes/v-image',
      'aurelia-v-grid/grid/attributes/v-drag-drop-col',
      'aurelia-v-grid/grid/attributes/v-changed',
      'aurelia-v-grid/grid/attributes/v-data-handler',
      'aurelia-v-grid/grid/attributes/v-resize-col',
      'aurelia-v-grid/grid/attributes/v-menu',
      'aurelia-v-grid/grid/attributes/v-selection',
      'aurelia-v-grid/grid/v-grid-row-repeat',
      'aurelia-v-grid/grid/v-grid-group-row',
      'aurelia-v-grid/grid/v-grid-group-element',
      'aurelia-v-grid/grid/v-grid-loadingscreen',
      'aurelia-v-grid/grid/v-grid-contextmenu',
      'aurelia-v-grid/grid/v-grid-footer',
      'aurelia-v-grid/grid/v-grid-col',
      'aurelia-v-grid/grid/v-grid'
    ]
  });

  return [aureliaPlugin, providerPlugin, moduleDependenciesPlugin, htmlWebpackPlugin,

    new ModuleDependenciesPlugin({
      'aurelia-froala-editor': ['./froala-editor'],
      'parent-module': ['child-module']
    }),

    ...when(extractCss, new ExtractTextPlugin({
      filename: production ? '[contenthash].css' : '[id].css',
      allChunks: true
    })),

    ...when(production, new CommonsChunkPlugin({
      name: ['common']
    })),


    new CopyWebpackPlugin([
      {from: 'manifest.json', to: 'manifest.json'}
    ])
  ];
};

const mathGamesConfig = function ({production, server, extractCss, coverage} = {}) {
  let template = {
    name: 'index'
  };
  return {
    resolve: {
      extensions: ['.js'],
      modules: [mathGamesDir, 'node_modules']
    },
    entry: {
      login: ['whatwg-fetch', 'babel-polyfill', 'aurelia-bootstrapper'],
      operator: ['bluebird']
    },
    output: {
      path: outDir,
      publicPath: baseUrl,
      filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
      sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
      chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
    },
    devServer: devServer,
    devtool: production ? 'nosources-source-map' : 'cheap-module-eval-source-map',
    module: {
      rules: rules({production, server, extractCss, coverage})
    },
    plugins: plugins({template, production, server, extractCss, coverage})
  };
};
module.exports = [mathGamesConfig];
