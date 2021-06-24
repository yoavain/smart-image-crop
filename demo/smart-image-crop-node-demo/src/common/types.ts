import type { Prediction } from "@yoavain/smart-image-crop-node";

export type AnnotateImageRequest = { file: any };
export type AnnotateImageResponse = { prediction: Prediction };
