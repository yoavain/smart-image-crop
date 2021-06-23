import type { Rank, Tensor } from "@tensorflow/tfjs-node";
import * as tf from "@tensorflow/tfjs-node";
import { promises as fs } from "fs";

// convert image to Tensor
export const processInput = async (imagePath: string): Promise<Tensor<Rank>> => {
    console.log(`preprocessing image ${imagePath}`);
    const image: Buffer = await fs.readFile(imagePath);
    return tf.node.decodeImage(new Uint8Array(image), 3).expandDims();
}
