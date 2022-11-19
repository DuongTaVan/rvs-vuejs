const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8085,
    https: {
      key: fs.readFileSync('.certs/key.pem'),
      cert: fs.readFileSync('.certs/cert.pem')
    }
  }

  // pwa: {
  //   name: 'default',
  //   iconPaths: {
  //     favicon32: '',
  //     favicon16: '',
  //     appleTouchIcon: '',
  //     maskIcon: '',
  //     msTileImage: ''
  //   }
  // }
});
