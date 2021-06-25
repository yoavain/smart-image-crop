// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { SmartImageCropDemo } from "./SmartImageCropDemo";
import "regenerator-runtime/runtime";
import { annotateImageService } from "./image-utils";

ReactDOM.render(
    <SmartImageCropDemo annotateImageService={annotateImageService}/>,
    document.getElementById("root")
);
