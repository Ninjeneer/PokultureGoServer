import Tensorflow from "./Tensorflow";

export default class RecognitionFactory {
  public static createTensorFlowrecognition(): Tensorflow {
    return new Tensorflow();
  }
}
