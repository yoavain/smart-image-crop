import type { Rank, Tensor } from "@tensorflow/tfjs-node-gpu";
import * as tf from "@tensorflow/tfjs-node-gpu";
import { promises as fs } from "fs";
import { annotateImage as coreAnnotateImage } from "@yoavain/smart-image-crop-core";
import type { Prediction } from "@yoavain/smart-image-crop-core";

type ImageInput = string | Buffer;

// convert image to Tensor
const processInput = async (imageInput: ImageInput): Promise<Tensor<Rank>> => {
    console.log(`preprocessing image ${imageInput}`);
    let image: Buffer;
    if (imageInput instanceof Buffer) {
        image = imageInput;
    }
    else if (typeof imageInput === "string") {
        image = await fs.readFile(imageInput);
    }
    return tf.node.decodeImage(new Uint8Array(image), 3).expandDims();
};

export const annotateImage = async (imageInput: ImageInput): Promise<Prediction> => {
    const inputTensor: Tensor<Rank> = await processInput(imageInput);
    return coreAnnotateImage(inputTensor);
};
