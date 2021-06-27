import type { FC } from "react";
import * as React from "react";
import { useEffect, useState } from "react";
import * as maxvis from "@codait/max-vis";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import type { Prediction } from "@yoavain/smart-image-crop-node";
import type { AnnotateImageService } from "./image-utils";

const originalImageDisplay = { width: "640px" };
const landscape = { width: "320px", height: "240px" };
const portrait = { width: "240px", height: "320px" };
const square = { width: "240px", height: "240px" };

export type SmartImageCropDemoProps = {
    annotateImageService: AnnotateImageService;
}

export const SmartImageCropDemo: FC<SmartImageCropDemoProps> = (props: SmartImageCropDemoProps) => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [image, setImage] = useState<string | ArrayBuffer>();
    const [prediction, setPrediction] = useState<Prediction>();
    const [annotatedImage, setAnnotatedImage] = useState<string>();
    const [detectionTime, setDetectionTime] = useState<number>();

    const [cropper, setCropper] = useState<any>();
    const [cropData, setCropData] = useState("#");

    const resetState = () => {
        setSelectedFile();
        setImage();
        setPrediction();
        setAnnotatedImage();
        setDetectionTime();
    };

    const imageRef = React.createRef();

    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                // convert image file to base64 string
                setImage(reader.result);
            }, false);

            reader.readAsDataURL(selectedFile);
        }
    }, [selectedFile]);

    useEffect(() => {
        if (image) {
            const startDate = new Date().valueOf();

            props.annotateImageService(selectedFile)
                .then((predictionJson: Prediction) => {
                    console.log(`Prediction: ${JSON.stringify(predictionJson, null, "\t")}`);
                    setPrediction(predictionJson);
                    return maxvis.annotate(predictionJson, image);
                })
                .then((annotatedImageBlob: Buffer) => {
                    setAnnotatedImage(URL.createObjectURL(annotatedImageBlob));
                    setDetectionTime(new Date().valueOf() - startDate);
                });
        }
    }, [image]);

    useEffect(() => {

    }, prediction);

    const onFileChange = (event) => {
        resetState();
        setSelectedFile(event.target.files[0]);
    };

    return <React.Fragment>
        <input type="file" onChange={onFileChange} />
        {!annotatedImage && image ?
            <div className="img-hover-zoom">
                <img ref={imageRef} src={image ?? ""} alt="Load image" style={{ display: "none" }}/>
                <img src={image ?? ""} alt="Load image" style={{ ...originalImageDisplay, margin: "20px" }}/>

                <Cropper
                    style={{ height: 400, width: "100%" }}
                    zoomTo={1}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    guides={false}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={false}
                    autoCropArea={0}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                />
            </div>
            :
            <div/>
        }
        {annotatedImage ?
            <div className="img-hover-zoom">
                <img src={annotatedImage ?? ""} alt="Annotated image" style={{ ...originalImageDisplay, margin: "20px" }}/>
                <div>Detection time: {detectionTime}ms</div>
            </div>
            :
            <div/>
        }
        {image ?
            <div>
                <img src={image} alt="Landscape" style={{ ...landscape, margin: "20px" }}/>
                <img src={image} alt="Square" style={{ ...square, margin: "20px" }}/>
                <img src={image} alt="Portrait" style={{ ...portrait, margin: "20px" }}/>

                <div
                    className="img-preview"
                    style={{ width: "100%", float: "left", height: "300px" }}
                />

                <img style={{ width: "100%" }} src={cropData} alt="cropped" />
            </div>
            :
            <div/>
        }
    </React.Fragment>;
};
