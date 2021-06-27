import type { FC } from "react";
import * as React from "react";
import { useEffect, useState } from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import type { Prediction } from "@yoavain/smart-image-crop-browser";
import type { AnnotateImageService } from "./image-utils";

export type SmartImageCropDemoProps = {
    annotateImageService: AnnotateImageService;
}

export const SmartImageCropDemo: FC<SmartImageCropDemoProps> = (props: SmartImageCropDemoProps) => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [image, setImage] = useState<string>();
    const [imageType, setImageType] = useState<string>();
    const [ratio, setRatio] = useState<number>(1);
    const [prediction, setPrediction] = useState<Prediction>();
    const [detectionTime, setDetectionTime] = useState<number>();
    const [croppedImage, setCroppedImage] = useState<string>();

    const resetState = () => {
        setSelectedFile();
        setImage();
        setImageType();
        setPrediction();
        setDetectionTime();
        setCroppedImage();
    };

    const imageRef = React.createRef();

    const parseImageType = (image: string): string => {
        return image.split(";")[0].split(":").pop();
    };
    
    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                // convert image file to base64 string
                setImage(reader.result as string);
            }, false);

            reader.readAsDataURL(selectedFile);
        }
    }, [selectedFile]);

    useEffect(() => {
        if (image) {
            setImageType(parseImageType(image));
            const startDate = new Date().valueOf();
            props.annotateImageService(imageRef.current)
                .then((predictionJson: Prediction) => {
                    setDetectionTime(new Date().valueOf() - startDate);
                    console.log(`Prediction: ${JSON.stringify(predictionJson, null, "\t")}`);
                    setPrediction(predictionJson);
                });
        }
    }, [image]);

    useEffect(() => {
        if (prediction) {
            const [x1, y1, x2, y2] = (prediction[0].bbox) as number[];
            const cropBoxData = {
                left: Math.min(x1, x2),
                top: Math.min(y1, y2),
                width: Math.abs(x2 - x1),
                height: Math.abs(y2 - y1)
            };

            new Cropper(imageRef.current, {
                // aspectRatio: ratio,
                background: false,
                cropBoxMovable: false,
                ready() {
                    this.cropper.setCropBoxData(cropBoxData);
                    
                    // Zoom the image to its natural size
                    this.cropper.zoomTo(1);

                    this.cropper.disable();
                },
                crop() {
                    if (imageType) {
                        setCroppedImage(this.cropper.getCroppedCanvas().toDataURL(imageType));
                    }
                },
                zoom(event) {
                    // Keep the image in its natural size
                    if (event.detail.oldRatio === 1) {
                        event.preventDefault();
                    }
                }
            });
        }
    }, [prediction]);

    const onFileChange = (event) => {
        resetState();
        setSelectedFile(event.target.files[0]);
    };

    const onChangeRatio = (event) => {
        setRatio(event.target.value);
    };

    return <React.Fragment>
        <input type="file" onChange={onFileChange} />
        <div onChange={onChangeRatio}>
            <input type="radio" value={16/9} name="ratio" /> Landscape (16:9)
            <input type="radio" value={1} name="ratio" /> Square
            <input type="radio" value={9/16} name="ratio" /> Portrait (9:16)
        </div>
        <div style={{ margin: "20px auto", maxWidth: "640px" }}>
            {image ? <img ref={imageRef} src={image} alt="Load image" style={{ display: "block", maxWidth: "100%" }}/> : <div/>}
            {croppedImage ? <img src={croppedImage} alt="cropped" style={{ display: "block", maxWidth: "100%" }}/> : <div/>}
        </div>
    </React.Fragment>;
};
