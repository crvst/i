var path = require('path');
var glob = require('glob');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var OfflinePlugin = require('offline-plugin');
var ClosureCompilerPlugin = require('webpack-closure-compiler');
var PurifyPlugin = require('purifycss-webpack');
var ManifestPlugin = require('webpack-manifest-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var url = require('url');
var paths = require('./paths');
var getClientEnvironment = require('./env');
var common = require('./common');

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

// We use "homepage" field to infer "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
var homepagePath = require(paths.appPackageJson).homepage;
var homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
var publicPath = ensureSlash(homepagePathname, true);
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = ensureSlash(homepagePathname, false);
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  devtool: 'source-map',
  // In production, we only want to load the polyfills and the app code.
  entry: {
    vendor: common.vendor,
    app: [
      require.resolve('./polyfills'),
      paths.appIndexJs
    ]
  },
  output: {
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'static/js/[name].bundle.[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath
  },
  resolve: {
    fallback: paths.nodePaths,
    extensions: ['.js', '.json', '.jsx', ''],
    alias: {
      'react-native': 'react-native-web'
    }
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        include: paths.appSrc,
        exclude: paths.appComponents,
        loader: ExtractTextPlugin.extract(
          ['style'],
          [
            'css?importLoaders=1',
            'postcss',
            'stylus'
          ]
        )
      },
      {
        test: /\.styl$/,
        include: paths.appComponents,
        loader: ExtractTextPlugin.extract(
          ['style'],
          [
            'css?modules&importLoaders=1&localIdentName=[hash:8]',
            'postcss',
            'stylus',
          ]),
      },
      {
        test: /\.(woff|woff2).css$/,
        include: paths.appSrc,
        loader: 'file',
        query: {
          name: 'static/css/[name].[ext]'
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
        query: {
          babelrc: true,
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      // See `imageWebpackLoader`
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        exclude: paths.svgSprites,
        loaders: [
          'file?hash=sha512&digest=hex&name=static/media/img-[hash:8].[ext]',
          'image-webpack'
        ]
      },
      {
        test: /\.svg$/,
        include: paths.appSrc,
        exclude: paths.svgSprites,
        loader: 'svg-sprite?' + JSON.stringify({
          name: '[name].[hash:8]',
          prefixize: true,
        })
      },
      {
        test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  // We use PostCSS for autoprefixing only.
  postcss: function () {
    return [
      autoprefixer({
        // http://browserl.ist/?q=%3E1%25%2C+last+4+versions%2C+Firefox+ESR%2C+not+ie+%3C+9
        browsers: [
          '> 1%',
          'last 2 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      }),
      require('css-mqpacker'),
      require('postcss-css-variables'),
      require('postcss-custom-media'),
      require('postcss-conditionals'),
    ];
  },
  imageWebpackLoader: {
    mozjpeg: {
      quality: 65
    },
    pngquant: {
      quality: '65-90',
      speed: 4
    },
    svgo: {
      plugins: [
        {
          removeViewBox: false
        },
        {
          removeEmptyAttrs: false
        }
      ]
    }
  },
  stylus: {
    use: [
      require('jeet')(),
      require('kouto-swiss')()
    ],
    import: [
      '~jeet/styl/index.styl',
      '~kouto-swiss/lib/kouto-swiss/index.styl',
    ]
  },
  plugins: [
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.DedupePlugin(),
    // Vendor bundle
    new webpack.optimize.CommonsChunkPlugin('vendor', 'static/js/vendor.bundle.[hash:8].js'),
    // new ClosureCompilerPlugin({
    //   compiler: {
    //     language_in: 'ECMASCRIPT6',
    //     language_out: 'ECMASCRIPT5',
    //     compilation_level: 'ADVANCED',
    //   },
    //   jsCompiler: true,
    //   concurrency: 3,
    // }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
    // new PurifyPlugin({
    //   // Give paths to parse for rules. These should be absolute!
    //   paths: glob.sync(path.join(__dirname, '../src/**/')),
    //   // paths: glob.sync(`${paths.appSrc}/*`),
    //   extensions: ['.html', '.jsx'],
    //   verbose: true,
    //   purifyOptions: {
    //     info: true,
    //     rejected: true
    //   }
    // }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        drop_console: true,
        warnings: false,
        dead_code: true,
        properties: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        passes: 3,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    new CompressionPlugin({
      algorithm: "zopfli",
      test: /\.js$|\.css$/,
      asset: '[path].gz[query]',
    }),
    new OfflinePlugin(),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
