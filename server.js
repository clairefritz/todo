import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from './data/schema';
import url from 'url-loader';
import file from 'file-loader';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
var graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack
  })
}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
var compiler = webpack({
  entry: [path.resolve(__dirname, 'js', 'app.js')],
  module: {
    loaders: [
      // support for fonts
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/font-woff"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=image/svg+xml"
      },
      { exclude: /node_modules/, loader: 'babel', test: /\.js$/}
    ]
  },
  output: {filename: 'app.js', path: '/'}
});

var app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/js/',
  stats: false,
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
