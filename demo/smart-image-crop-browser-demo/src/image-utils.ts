import type { Prediction } from "@yoavain/smart-image-crop-browser";
import { annotateImage } from "@yoavain/smart-image-crop-browser";

export type AnnotateImageService = (imageElement: HTMLImageElement) => Promise<Prediction>

export const annotateImageService: AnnotateImageService = async (imageElement: HTMLImageElement): Promise<Prediction> => {
    return annotateImage(imageElement);
};
