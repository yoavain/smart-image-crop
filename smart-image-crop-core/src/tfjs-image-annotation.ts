import type { GraphModel, Rank, Tensor } from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import { labels } from "./labels";
import type { Prediction } from "./types";

// todo - https://www.tensorflow.org/js/guide/save_load
const modelUrl = "https://tfhub.dev/tensorflow/tfjs-model/ssdlite_mobilenet_v2/1/default/1";
const maxNumBoxes = 8;

// load COCO-SSD graph model
let model: GraphModel;
const loadModel = async (): Promise<GraphModel> => {
    if (!model) {
        model = await tf.loadGraphModel(modelUrl, { fromTFHub: true });
    }
    return model;
};

// run prediction with the provided input Tensor
const runModel = (model: GraphModel, inputTensor: Tensor<Rank>): Promise<Tensor | Tensor[]> => {
    console.log("running model");
    return model.executeAsync(inputTensor);
};

// process the model output into a friendly JSON format
const processOutput = (prediction: Tensor<Rank> | Tensor[], width: number, height: number): Prediction => {
    console.log("processOutput");
    const [maxScores, classes] = extractClassesAndMaxScores(prediction[0]);
    const indexes = calculateNMS(prediction[1], maxScores);

    return createJsonResponse(prediction[1].dataSync(), maxScores, indexes, classes, width, height);
};

// determine the classes and max scores from the prediction
const extractClassesAndMaxScores = (predictionScores) => {
    console.log("calculating classes & max scores");

    const scores = predictionScores.dataSync();
    const numBoxesFound = predictionScores.shape[1];
    const numClassesFound = predictionScores.shape[2];

    const maxScores = [];
    const classes = [];

    // for each bounding box returned
    for (let i = 0; i < numBoxesFound; i++) {
        let maxScore = -1;
        let classIndex = -1;

        // find the class with the highest score
        for (let j = 0; j < numClassesFound; j++) {
            if (scores[i * numClassesFound + j] > maxScore) {
                maxScore = scores[i * numClassesFound + j];
                classIndex = j;
            }
        }

        maxScores[i] = maxScore;
        classes[i] = classIndex;
    }

    return [maxScores, classes];
};

// perform non maximum suppression of bounding boxes
const calculateNMS = (outputBoxes, maxScores) => {
    console.log("calculating box indexes");

    const boxes = tf.tensor2d(outputBoxes.dataSync(), [outputBoxes.shape[1], outputBoxes.shape[3]]);
    const indexTensor = tf.image.nonMaxSuppression(boxes, maxScores, maxNumBoxes, 0.5, 0.5);

    return indexTensor.dataSync();
};

// create JSON object with bounding boxes and label
const createJsonResponse = (boxes, scores, indexes, classes, width: number, height: number): Prediction => {
    console.log("create JSON output");

    const count = indexes.length;
    const objects = [];

    for (let i = 0; i < count; i++) {
        const bbox = [];

        for (let j = 0; j < 4; j++) {
            bbox[j] = boxes[indexes[i] * 4 + j];
        }

        const minY = Math.max(0, bbox[0] * height);
        const minX = Math.max(0, bbox[1] * width);
        const maxY = Math.min(height, bbox[2] * height);
        const maxX = Math.min(width, bbox[3] * width);

        objects.push({
            bbox: [minX, minY, maxX, maxY],
            label: labels[classes[indexes[i]]],
            score: scores[indexes[i]]
        });
    }

    return objects;
};

export const annotateImage = async (inputTensor: Tensor<Rank>): Promise<Prediction> => {
    try {
        const model: GraphModel = await loadModel();
        const height = inputTensor.shape[1];
        const width = inputTensor.shape[2];
        const prediction: Tensor<Rank> | Tensor[] = await runModel(model, inputTensor);

        return processOutput(prediction, width, height);
    }
    catch (err) {
        console.error(err);
    }
};
