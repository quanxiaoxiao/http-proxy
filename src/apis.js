const path = require('path');
const fs = require('fs');


const hostMap = {
  duty: 'http://192.168.0.69:8094',
  acl: 'http://192.168.0.69:8096',
  aclps: 'http://192.168.0.69:8099',
};

module.exports = {
  '/tile/(.*)': {
    get: {
      file: (ctx) => {
        const pathname = path.resolve(__dirname, '..', 'tiles', ctx.matchs[1]);
        if (!fs.existsSync(pathname)) {
          return path.resolve(__dirname, '..', 'tiles', 'pure');
        }
        return pathname;
      },
    },
  },
  ...Object
    .entries(hostMap)
    .reduce((acc, [key, value]) => ({
      ...acc,
      [`/${key}/(.*)?`]: {
        proxy: value,
      },
    }), {}),

};
