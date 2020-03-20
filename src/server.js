const path = require('path');
const http = require('http');
const Koa = require('koa');
const winston = require('winston');
const router = require('@quanxiaoxiao/router');
const www = require('@quanxiaoxiao/www');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const config = require('./config');

const apis = require('./apis');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.resolve(config.loggerPath, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.resolve(config.loggerPath, 'combined.log'),
    }),
  ],
});

const app = new Koa();

app.use(async (ctx, next) => {
  const { method, originalUrl } = ctx;
  ctx.logger = logger;
  try {
    await next();
  } catch (error) {
    logger.error(`[${method}] ${originalUrl} ${error.message}`);
    throw error;
  }
});

app.use(compress());
app.use(conditional());
app.use(etag());

app.use(router({
  ...www(
    Object
      .entries(config.dist.projects)
      .reduce((acc, [projectName, value]) => ({
        ...acc,
        [projectName]: {
          key: value.key,
          pages: {
            ...value.pathList.reduce((pathes, pathname) => ({
              ...pathes,
              [pathname]: () => 'index.html',
            }), {
              [value.staticPath]:
            (matchs) => decodeURIComponent(matchs[1]),
            }),
          },
        },
      }), {}),
    config.dist.dbPathName,
    config.dist.staticPath,
  ),
  ...apis,
}, logger));

const server = http.createServer({}, app.callback());

server.listen(config.port, () => {
  logger.info(`server listen at port: ${config.port}`);
});


process.on('uncaughtException', (error) => {
  console.error(error);
  logger.error(`${Date.now()} ${error.message}`);
  const killTimer = setTimeout(() => {
    process.exit(1);
  }, 3000);
  killTimer.unref();
});
