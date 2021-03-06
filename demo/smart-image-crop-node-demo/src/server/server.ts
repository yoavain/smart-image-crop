import fastify from "fastify";
import type { FastifyInstance, FastifyLoggerInstance, RawReplyDefaultExpression, RawRequestDefaultExpression } from "fastify";
import type { Server } from "http";
import * as path from "path";

require("make-promises-safe"); // installs an 'unhandledRejection' handler

const compress = require("fastify-compress");
const helmet = require("fastify-helmet");
const multipart = require("fastify-multipart");

export type FastifyServer = FastifyInstance<
    Server,
    RawRequestDefaultExpression<Server>,
    RawReplyDefaultExpression<Server>,
    FastifyLoggerInstance> & PromiseLike<FastifyInstance<Server,
    RawRequestDefaultExpression<Server>, RawReplyDefaultExpression<Server>, FastifyLoggerInstance>
>

const server: FastifyServer = fastify({
    logger: true
});

server.register(helmet,  { contentSecurityPolicy: false });
server.register(compress);
server.register(multipart);

server.register(require("fastify-static"), {
    root: path.join(__dirname, "..", "..", "./public")
});

server.register(require("./annotateImage"));

const start = async () => {
    try {
        await server.listen(9090);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start().catch(console.error);
