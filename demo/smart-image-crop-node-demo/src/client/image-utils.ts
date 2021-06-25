import type { AxiosResponse } from "axios";
import axios from "axios";
import type { AnnotateImageResponse } from "../common/types";
import type { Prediction } from "@yoavain/smart-image-crop-node";

export type AnnotateImageService = (selectedFile: File) => Promise<Prediction>

export const annotateImageService: AnnotateImageService = async (selectedFile: File): Promise<Prediction> => {
    const formData = new FormData();
    formData.append("image", selectedFile);
    const response: AxiosResponse<AnnotateImageResponse> = await axios.post("/api/annotate-image", formData, { headers: { "Content-Type": "multipart/form-data" } });
    return response.data.prediction;
};
