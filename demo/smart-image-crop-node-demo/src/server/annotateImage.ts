import type { FastifyServer } from "./server";

const defaultRoute = async (fastify: FastifyServer, options) => {
    fastify.post('/annotate-image', async (request, reply) => {
        // do something
        return { hello: 'world' }
    })
}

export default defaultRoute
