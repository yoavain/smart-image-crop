import * as React from "react";
import { FC, useEffect, useState } from "react";
import { annotateImage } from "@yoavain/smart-image-crop-core";
import { processInput } from "@yoavain/smart-image-crop-browser";
import * as maxvis from "@codait/max-vis";
import type { Rank, Tensor } from "@tensorflow/tfjs";

const originalImageDisplay = { width: "640px" };
const landscape = { width: "320px", height: "240px"};
const portrait = { width: "240px", height: "320px" };
const square = { width: "240px", height: "240px" };


export const App: FC<{}> = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [image, setImage] = useState();
    const [annotatedImage, setAnnotatedImage] = useState();


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
            processInput(imageRef.current)
                .then((tensor: Tensor<Rank>) => {
                    return annotateImage(tensor);
                })
                .then(predictionJson => {
                    return maxvis.annotate(predictionJson, image);
                })
                .then((annotatedImageBlob: Buffer) => {
                    setAnnotatedImage(URL.createObjectURL(annotatedImageBlob));
                })
        }
    }, [image])

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0])
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
    </React.Fragment>
}
