import type { FastifyServer } from "./server";
import type { AnnotateImageRequest, AnnotateImageResponse } from "../common/types";
import { annotateImage } from "@yoavain/smart-image-crop-node";
import type { Prediction } from "@yoavain/smart-image-crop-node";

const defaultRoute = async (fastify: FastifyServer, options) => {
    fastify.post<{ Body: AnnotateImageRequest; Response: AnnotateImageResponse }>("/api/annotate-image", async (request, reply) => {
        // @ts-ignore
        const data = await request.file();
        const image: Buffer = await data.toBuffer();

        const prediction: Prediction = await annotateImage(image);

        console.log(prediction);

        return { prediction };
    });
};

export default defaultRoute;
