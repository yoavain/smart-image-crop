import * as tf from "@tensorflow/tfjs";
export const cropImage = async (image) => {

    const output = tf.image.cropAndResize(image, boxes, boxInd, [3, 3], 'bilinear', 0);
    expect(output.shape).toEqual([1, 3, 3, 1]);
    expectArraysClose(await output.data(), [1, 1.5, 2, 2, 2.5, 3, 3, 3.5, 4]);
}
