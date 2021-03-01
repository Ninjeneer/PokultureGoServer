import Recognition from "./Recognition";
import * as tf from '@tensorflow/tfjs-core';
import * as mobilenet from '@tensorflow-models/mobilenet';
import fs from 'fs';
import jpeg from 'jpeg-js';
import config from '../../../assets/config.json'
import { AppError } from "../../Types";

export default class Tensorflow extends Recognition {
  private static model: mobilenet.MobileNet;

  async recognizeImage(base64Image: string): Promise<string[]> {
    const path = 'tmp/' + Date.now();
    const base64Data = base64Image.trim().replace(/^data:([A-Za-z-+/]+);base64,/, '');
    // Create tmp directory if needed
    if (!fs.existsSync('tmp')) {
      fs.mkdirSync('tmp');
    }
    // Save image on disk
    fs.writeFileSync(path, base64Data, { encoding: 'base64' });
    let predictions;
    try {
      predictions = await this.processRecognition(path);
    } catch (e) {
      // Delete asynchronously the saved image
      fs.unlink(path, () => { });
      throw new AppError({
        message: 'Unable to process image',
        stack: e.stack,
      });
    }
    // Delete asynchronously the saved image
    fs.unlink(path, () => { });
    const results: string[] = [];
    for (const prediction of predictions) {
      prediction.className.split(",").forEach(p1 => {
        p1.split(" ").forEach(p2 => results.push(p2));
      });
    }
    return results;
  }

  private readImage(path: string) {
    const image = fs.readFileSync(path);
    return jpeg.decode(image);
  }

  private imageByteArray(image, numChannels): Int32Array {
    const pixels = image.data
    const numPixels = image.width * image.height;
    const values = new Int32Array(numPixels * numChannels);

    for (let i = 0; i < numPixels; i++) {
      for (let channel = 0; channel < numChannels; ++channel) {
        values[i * numChannels + channel] = pixels[i * 4 + channel];
      }
    }

    return values
  }

  private imageToInput(image, nbChannels: number): tf.Tensor3D {
    const values = this.imageByteArray(image, nbChannels)
    const input = tf.tensor3d(values, [image.height, image.width, nbChannels], 'int32');
    return input
  }

  private async processRecognition(path: string): Promise<Array<{ className: string, probability: number }>> {
    const image = this.readImage(path);
    const input = this.imageToInput(image, 3);
    if (!Tensorflow.model || Tensorflow.model === null) {
      Tensorflow.model = await mobilenet.load();
    }
    return await Tensorflow.model.classify(input, config.imageRecognition.nbResults);
  }
}
