import * as React from "react";
import { FC, useEffect, useState } from "react";
import { annotateImage } from "@yoavain/smart-image-crop-core";
import { processInput } from "@yoavain/smart-image-crop-browser";
import * as maxvis from "@codait/max-vis";
import type { Rank, Tensor } from "@tensorflow/tfjs";

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
        {image ?
            <div className="img-hover-zoom">
                <img ref={imageRef} src={image ?? ""} alt="Load image" />
            </div>
            :
            <div/>
        }
        {annotatedImage ?
            <div className="img-hover-zoom">
                <img src={annotatedImage ?? ""} alt="Annotated image" style={{ width: "640px", margin: "20px" }}/>
            </div>
            :
            <div/>
        }
        {image ?
            <div>
                <img src={image} alt="Load image" style={{ width: "320px", height: "240px", margin: "20px" }}/>
                <img src={image} alt="Load image" style={{ width: "240px", height: "240px", margin: "20px" }}/>
                <img src={image} alt="Load image" style={{ width: "240px", height: "320px", margin: "20px" }}/>
            </div>
            :
            <div/>
        }
    </React.Fragment>
}
