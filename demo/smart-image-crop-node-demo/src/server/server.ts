import fastify, { FastifyInstance, FastifyLoggerInstance, RawReplyDefaultExpression, RawRequestDefaultExpression } from 'fastify';
import type { FastifyInstance, FastifyLoggerInstance, RawReplyDefaultExpression, RawRequestDefaultExpression } from 'fastify';
import type { Server } from 'http';
import * as path from "path";

require('make-promises-safe') // installs an 'unhandledRejection' handler

const compress = require("fastify-compress");
const helmet = require("fastify-helmet")

export type FastifyServer = FastifyInstance<Server, RawRequestDefaultExpression<Server>, RawReplyDefaultExpression<Server>, FastifyLoggerInstance> & PromiseLike<FastifyInstance<Server, RawRequestDefaultExpression<Server>, RawReplyDefaultExpression<Server>, FastifyLoggerInstance>>

const server: FastifyServer = fastify({
  logger: true
})

server.register(helmet);
server.register(compress);

server.register(require('fastify-static'), {
  root: path.join(__dirname, "..", "..", './public')
})
server.setNotFoundHandler((req, res) => {
  res.sendFile('index.html')
})

// server.register(require('./static'));
server.register(require('./annotateImage'));

const start = async () => {
  try {
    await server.listen(1235)
  }
  catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start().catch(console.error)
