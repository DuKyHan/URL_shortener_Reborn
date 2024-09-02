import nodeExternals from 'webpack-node-externals';

export default (args) => ({
  ...args,
  externals: [nodeExternals({ modulesDir: '../../node_modules' })],
});
