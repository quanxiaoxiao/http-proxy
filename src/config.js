const path = require('path');

module.exports = {
  port: 3000,
  dist: {
    projects: {
      attendance: {
        key: 'myVIfYsvlZzxjRXOb4NA3HrJhTB70WUp',
        pathList: [
          '/',
          '/login',
          '/schedule/(.*)?',
          '/post/(.*)?',
          '/statistics/(.*)?',
          '/distribution/(.*)?',
          '/organization/(.*)?',
          '/personal/(.*)?',
          '/system/(.*)?',
          '/attendance/(.*)?',
          '/assessment/(.*)?',
        ],
        staticPath: '/static/attendance/(.*)',
      },
    },
    dbPathName: path.resolve(__dirname, '..', 'db.json'),
    staticPath: path.resolve(__dirname, '..', 'dist'),
  },
  loggerPath: path.resolve(__dirname, '..', 'logs'),
};
