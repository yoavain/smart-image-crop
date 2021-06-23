import type { Rank, Tensor } from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";

// convert image to Tensor
export const processInput = async (image: HTMLImageElement): Promise<Tensor<Rank>> => {
    console.log("preprocessing image");
    return tf.browser.fromPixels(image, 3).expandDims();
}
