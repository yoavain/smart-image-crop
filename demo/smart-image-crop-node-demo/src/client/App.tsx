import * as React from "react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import * as maxvis from "@codait/max-vis";
import axios from "axios";

const originalImageDisplay = { width: "640px" };
const landscape = { width: "320px", height: "240px" };
const portrait = { width: "240px", height: "320px" };
const square = { width: "240px", height: "240px" };

export const App: FC<{}> = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [image, setImage] = useState();
    const [prediction, setPrediction] = useState();
    const [annotatedImage, setAnnotatedImage] = useState();
    const [detectionTime, setDetectionTime] = useState();

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

            const formData = new FormData();
            formData.append("image", selectedFile);
            axios.post("/api/annotate-image", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((prediction) => {
                    // todo
                    console.log(prediction);
                });
            /*
            annotateImage(imageRef.current)
                .then(predictionJson => {
                    console.log(`Prediction: ${JSON.stringify(predictionJson, null, "\t")}`);
                    setPrediction(predictionJson);
                    return maxvis.annotate(predictionJson, image);
                })
                .then((annotatedImageBlob: Buffer) => {
                    setAnnotatedImage(URL.createObjectURL(annotatedImageBlob));
                    setDetectionTime(new Date().valueOf() - startDate);
                })
             */
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
            </div>
            :
            <div/>
        }
    </React.Fragment>;
};
