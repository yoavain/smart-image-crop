import type { Rank, Tensor } from "@tensorflow/tfjs-node-gpu";
import * as tf from "@tensorflow/tfjs-node-gpu";
import { promises as fs } from "fs";
import { annotateImage as coreAnnotateImage } from "@yoavain/smart-image-crop-core";

// convert image to Tensor
const processInput = async (imagePath: string): Promise<Tensor<Rank>> => {
    console.log(`preprocessing image ${imagePath}`);
    const image: Buffer = await fs.readFile(imagePath);
    return tf.node.decodeImage(new Uint8Array(image), 3).expandDims();
}

export const annotateImage = async (imagePath: string): Promise<any> => {
    const inputTensor: Tensor<Rank> = await processInput(imagePath);
    return coreAnnotateImage(inputTensor);
}
