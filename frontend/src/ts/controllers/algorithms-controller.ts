import { randomElementFromArray } from "../utils/arrays";
import { AlgorithmPrompt, getAlgorithmList } from "../utils/json-data";
import { RequiredProperties } from "../utils/misc";

export type Algorithm = AlgorithmPrompt & {
  textSplit?: string[];
};

export type AlgorithmWithTextSplit = RequiredProperties<Algorithm, "textSplit">;

class AlgorithmsController {
  private algorithms: Algorithm[] = [];
  private loaded = false;

  async getAlgorithms(): Promise<Algorithm[]> {
    if (!this.loaded) {
      this.algorithms = await getAlgorithmList();
      this.loaded = true;
    }

    return this.algorithms;
  }

  async getAlgorithmById(id: string): Promise<Algorithm | undefined> {
    const algorithms = await this.getAlgorithms();
    return algorithms.find((algorithm) => algorithm.id === id);
  }

  async getRandomAlgorithm(): Promise<Algorithm | null> {
    const algorithms = await this.getAlgorithms();
    if (algorithms.length === 0) {
      return null;
    }

    return randomElementFromArray(algorithms);
  }
}

export default new AlgorithmsController();
