import { NeuralNetwork } from "./network"


class NetworkManager {
    activationColor = 'rgb(0, 137, 236)'
    negativeColor = 'rgb(241, 0, 19)'
    learningRate = 1
    bias = 0
    hiddenLayersCount = 5
    hiddenPerceptronCount = 5

    IDIndex = -1
    networks: {[ID: string]: NeuralNetwork}
    visualsParent: Partial<HTMLElement>

    constructor() {

        this.networks = {}
    }

    init() {

        this.initVisuals()
    }

    private initVisuals() {
        this.visualsParent = document.getElementById('networkManagerParent')

        document.getElementById('colorGuideActivation').style.background = networkManager.activationColor;
        document.getElementById('colorGuideNegative').style.background = networkManager.negativeColor
    }

    newID() {

        this.IDIndex += 1
        return this.IDIndex.toString()
    }
}

export const networkManager = new NetworkManager()