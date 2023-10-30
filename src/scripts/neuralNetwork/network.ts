import { networkManager } from "./networkManager"
import { mutateDelta, relu } from "./networkUtils"

export class Input {
    name: string
    values: number[]
    weightIDs: string[]

    constructor(name: string, values: number[], weightIDs: string[]) {

        this.name = name
        this.values = values
        this.weightIDs = weightIDs
    }
}
export class Output {
    name: string

    constructor(name: string) {

        this.name = name
    }
}

export type WeightLayers = number[][][]
export type ActivationLayers = number[][]

export class NeuralNetwork {
    ID: string
    weightLayers: WeightLayers = []
    /**
     * An ID reference to weights for a set of input perceptrons
     */
    weightsByID: {[ID: string]: number} = {}
    /**
     * An input perceptron by input value weight of ids to find the input's weight
     */
    inputWeightLayers: string[][] = []
    activationLayers: ActivationLayers
    visualsParent: HTMLElement
    inputLayerVisuals: HTMLElement[]
    inputLayer: HTMLElement
    perceptronLayers: HTMLElement[]
    perceptronVisualLayers: HTMLElement[][]
    linesParent: SVGElement
    lineLayers: SVGElement[][][]

    constructor(weightLayers: WeightLayers = [], activationLayers: ActivationLayers = []) {

        this.weightLayers = weightLayers
        this.activationLayers = activationLayers

        this.ID = networkManager.newID()
        networkManager.networks[this.ID] = this
    }
    init(inputs: Input[], outputCount: number) {
    
        this.weightLayers.push([])
        this.activationLayers.push([])
    
        for (let i = 0; i < inputs.length; i++) {

            const input = inputs[i]
            this.inputWeightLayers.push(input.weightIDs)

            this.weightLayers[0].push([])
            this.activationLayers[0].push(0)

            for (let value_i = 0; value_i < input.values.length; value_i++) {

                this.weightsByID[input.weightIDs[value_i]] = networkManager.bias
                this.weightLayers[0][i].push(networkManager.bias)
            }
        }
    
        for (let layerIndex = 1; layerIndex < networkManager.hiddenLayersCount + 1; layerIndex++) {
    
            this.weightLayers.push([])
            this.activationLayers.push([])
    
            for (let i1 = 0; i1 < networkManager.hiddenPerceptronCount; i1++) {
    
                this.weightLayers[layerIndex].push([])
    
                const previousLayerOutputCount = this.activationLayers[layerIndex - 1].length
    
                for (let i2 = 0; i2 < previousLayerOutputCount; i2++) {
    
                    this.weightLayers[layerIndex][i1].push(networkManager.bias)
                }
    
                this.activationLayers[layerIndex].push(0)
            }
        }
    
        this.weightLayers.push([])
        this.activationLayers.push([])
    
        const lastLayerIndex = this.activationLayers.length - 1,
            previousLayerOutputCount = this.activationLayers[lastLayerIndex - 1].length
        
        for (let i1 = 0; i1 < outputCount; i1++) {
    
            this.weightLayers[lastLayerIndex].push([])
    
            for (let i2 = 0; i2 < previousLayerOutputCount; i2++) {
    
                this.weightLayers[lastLayerIndex][i1].push(networkManager.bias)
            }
    
            this.activationLayers[lastLayerIndex].push(0)
        }
    }
    
    clone() {
    
        const network = this
    
        return new NeuralNetwork(Array.from(network.weightLayers), Array.from(network.activationLayers))
    }
    
    forwardPropagate(inputs: Input[]) {
    
        // First layer using inputs
    
        for (let i = 0; i < inputs.length; i++) {
    
            this.activationLayers[0][i] = 0
        }

        for (let i = 0; i < inputs.length; i++) {
    
            const input = inputs[i]

            for (let value_i = 0; value_i < input.values.length; value_i++) {

                this.activationLayers[0][i] = relu(input.values[value_i] * this.weightsByID[input.weightIDs[value_i]])
            }
        }
    
        // Following layers using previous perceptron's values
    
        for (let layerIndex = 1; layerIndex < this.activationLayers.length; layerIndex++) {
    
            for (let activationsIndex = 0; activationsIndex < this.activationLayers[layerIndex].length; activationsIndex++) {
    
                this.activationLayers[layerIndex][activationsIndex] = 0
    
                for (let previousLayerActivationsIndex = 0; previousLayerActivationsIndex < this.activationLayers[layerIndex - 1].length; previousLayerActivationsIndex++) {
    
                    this.activationLayers[layerIndex][activationsIndex] += this.activationLayers[layerIndex - 1][previousLayerActivationsIndex] * this.weightLayers[layerIndex][activationsIndex][previousLayerActivationsIndex]
                }
    
                this.activationLayers[layerIndex][activationsIndex] = relu(this.activationLayers[layerIndex][activationsIndex] + networkManager.bias)
            }
        }
    }
/*     
    backPropagate(scoredOutputs) {
    
        const network = this
    
    
    }
     */
    mutate() {

        // Input layers special for homogenous weights

        for (const ID in this.weightsByID) {

            this.weightsByID[ID] += mutateDelta()
        }

        // Non-input layers
    
        for (let layerIndex = 0; layerIndex < this.weightLayers.length; layerIndex++) {
    
            for (let activationsIndex = 0; activationsIndex < this.activationLayers[layerIndex].length; activationsIndex++) {
    
                for (let weightIndex = 0; weightIndex < this.weightLayers[layerIndex][activationsIndex].length; weightIndex++) {
    
                    this.weightLayers[layerIndex][activationsIndex][weightIndex] += mutateDelta()
                }
            }
        }
    }
    
    createVisuals(inputs: Input[], outputs: Output[]) {
    
        const network = this
    
        // Visual parents
    
        network.visualsParent = document.createElement('div')
    
        networkManager.visualsParent.appendChild(network.visualsParent)
    
        network.visualsParent.classList.add('networkParent')
    
        let descriptionLayers = [],
            descriptionVisualLayers: Element[][] = [
                [],
                []
            ]
    
        // Input descriptions
    
        let descriptionLayerVisual = document.createElement('div')
        descriptionLayerVisual.classList.add('descriptionLayer')
    
        descriptionLayerVisual.classList.add('inputDescriptionLayer')
    
        network.visualsParent.appendChild(descriptionLayerVisual)
        descriptionLayers.push(descriptionLayerVisual)
        
        for (let activationsIndex = 0; activationsIndex < network.activationLayers[0].length; activationsIndex++) {
    
            const descriptionVisual = document.createElement('p')
    
            descriptionLayers[0].appendChild(descriptionVisual)
            descriptionVisualLayers[0].push(descriptionVisual)
    
            descriptionVisual.innerText = inputs[activationsIndex].name
        }
    
        // Inputs
    
        network.inputLayerVisuals = []
    
        network.inputLayer = document.createElement('div')
    
        network.visualsParent.appendChild(network.inputLayer)
    
        network.inputLayer.classList.add('inputLayer')
    
        for (let activationsIndex = 0; activationsIndex < network.activationLayers[0].length; activationsIndex++) {
    
            const inputVisual = document.createElement('p'),
                activation = inputs[activationsIndex].values
    
            network.inputLayer.appendChild(inputVisual)
            network.inputLayerVisuals.push(inputVisual)
/*     
            inputVisual.style.color = activation <= 0 ? networkManager.negativeColor : networkManager.activationColor
    
            inputVisual.innerText = activation.toFixed(2)
             */
            inputVisual.innerText = activation.toString()
        }
    
        // Perceptrons and layers
    
        network.perceptronLayers = []
        network.perceptronVisualLayers = []
    
        for (let layerIndex = 0; layerIndex < network.activationLayers.length; layerIndex++) {
    
            network.perceptronVisualLayers.push([])
    
            const perceptronLayerVisual = document.createElement('div')
    
            network.visualsParent.appendChild(perceptronLayerVisual)
            network.perceptronLayers.push(perceptronLayerVisual)
    
            perceptronLayerVisual.classList.add('perceptronLayer')
    
            for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {
    
                const perceptronVisual = document.createElement('div'),
                    activation = network.activationLayers[layerIndex][activationsIndex]
    
                perceptronLayerVisual.appendChild(perceptronVisual)
                network.perceptronVisualLayers[layerIndex].push(perceptronVisual)
    
                perceptronVisual.style.borderColor = activation <= 0 ? networkManager.negativeColor : networkManager.activationColor
    
                if (activation <= 0) {

                    perceptronVisual.innerText = '0'
                    continue
                }
                if (activation >= 1000) {

                    perceptronVisual.innerText = activation.toExponential(2)
                    continue
                }
                perceptronVisual.innerText = activation.toFixed(2)
            }
        }
    
        // Output descriptions
    
        descriptionLayerVisual = document.createElement('div')
        descriptionLayerVisual.classList.add('descriptionLayer')
    
        network.visualsParent.appendChild(descriptionLayerVisual)
        descriptionLayers.push(descriptionLayerVisual)
    
        for (let activationsIndex = 0; activationsIndex < network.activationLayers[network.activationLayers.length - 1].length; activationsIndex++) {
    
            const descriptionVisual = document.createElement('p')
    
            descriptionLayers[1].appendChild(descriptionVisual)
            descriptionVisualLayers[1].push(descriptionVisual)
    
            descriptionVisual.innerText = outputs[activationsIndex].name
        }
    
        // Lines
    
        network.linesParent = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        network.linesParent.classList.add('linesParent')
    
        network.visualsParent.appendChild(network.linesParent)
    
        network.lineLayers = [
            []
        ]
    
        for (let layerIndex = 1; layerIndex < network.activationLayers.length; layerIndex++) {
    
            network.lineLayers.push([])
    
            for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {
    
                network.lineLayers[layerIndex].push([])
    
                for (let weightIndex = 0; weightIndex < network.weightLayers[layerIndex][activationsIndex].length; weightIndex++) {
    
                    const lineVisual = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    
                    network.linesParent.appendChild(lineVisual)
                    network.lineLayers[layerIndex][activationsIndex].push(lineVisual)
    
                    lineVisual.style.stroke = network.weightLayers[layerIndex][activationsIndex][weightIndex] <= 0 ? networkManager.negativeColor : networkManager.activationColor
    
                    const perceptron1VisualRect = network.perceptronVisualLayers[layerIndex - 1][weightIndex].getBoundingClientRect(),
                        perceptron2VisualRect = network.perceptronVisualLayers[layerIndex][activationsIndex].getBoundingClientRect(),
                        visualsParentRect = network.visualsParent.getBoundingClientRect()
    
                    lineVisual.setAttribute('x1', Math.floor(perceptron1VisualRect.left + perceptron1VisualRect.width / 2 - visualsParentRect.left).toString())
                    lineVisual.setAttribute('y1', Math.floor(perceptron1VisualRect.top + perceptron1VisualRect.height / 2 - visualsParentRect.top).toString())
                    lineVisual.setAttribute('x2', Math.floor(perceptron2VisualRect.left + perceptron2VisualRect.width / 2 - visualsParentRect.left).toString())
                    lineVisual.setAttribute('y2', Math.floor(perceptron2VisualRect.top + perceptron2VisualRect.height / 2 - visualsParentRect.top).toString())
                }
            }
        }
    }
    
    updateVisuals(inputs: Input[]) {
    
        const network = this
    
        // Inputs
    
        for (let activationsIndex = 0; activationsIndex < network.activationLayers[0].length; activationsIndex++) {
    
            const inputVisual = network.inputLayerVisuals[activationsIndex],
                activation = inputs[activationsIndex].values
/*     
            inputVisual.style.color = activation <= 0 ? networkManager.negativeColor : networkManager.activationColor
    
            inputVisual.innerText = activation.toFixed(2)
             */
            
        }
    
        // Perceptrons and layers
    
        for (let layerIndex = 0; layerIndex < network.activationLayers.length; layerIndex++) {
    
            for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {
    
                const perceptronVisual = network.perceptronVisualLayers[layerIndex][activationsIndex],
                    activation = network.activationLayers[layerIndex][activationsIndex]
    
                perceptronVisual.style.borderColor = activation <= 0 ? networkManager.negativeColor : networkManager.activationColor
    
                if (activation <= 0) {

                    perceptronVisual.innerText = '0'
                    continue
                }
                if (activation >= 1000) {

                    perceptronVisual.innerText = activation.toExponential(2)
                    continue
                }
                perceptronVisual.innerText = activation.toFixed(2)
            }
        }
    
        // Lines
    
        for (let layerIndex = 1; layerIndex < network.activationLayers.length; layerIndex++) {
    
            for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {
    
                for (let weightIndex = 0; weightIndex < network.weightLayers[layerIndex][activationsIndex].length; weightIndex++) {
    
                    const lineVisual = network.lineLayers[layerIndex][activationsIndex][weightIndex]
                    lineVisual.setAttribute('text', network.weightLayers[layerIndex][activationsIndex][weightIndex].toString())
                    lineVisual.style.stroke = network.weightLayers[layerIndex][activationsIndex][weightIndex] <= 0 ? networkManager.negativeColor : networkManager.activationColor
                }
            }
        }
    }
}