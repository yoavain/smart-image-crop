import type { Rank, Tensor } from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import { annotateImage as coreAnnotateImage } from "@yoavain/smart-image-crop-core";

// convert image to Tensor
const processInput = async (image: HTMLImageElement): Promise<Tensor<Rank>> => {
    console.log("preprocessing image");
    return tf.browser.fromPixels(image, 3).expandDims();
};

export const annotateImage = async (image: HTMLImageElement): Promise<any> => {
    const inputTensor: Tensor<Rank> = await processInput(image);
    return coreAnnotateImage(inputTensor);
};
