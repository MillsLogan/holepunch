import CellRepresentation from "./CellRepresentation";

export default class Cell {
    constructor(point) {
        this.point = point;;
        this.representations = [new CellRepresentation(this.point)];
        this.isPunched = false;
    }

    addRepresentation(representation) {
        if (this.representations.at(-1).isHalved) {
            representation.isHalved = true;
        }
        this.representations.push(representation);
    }

    getRepresentationAt(index) {
        if (index < 0 || index >= this.representations.length) {
            throw new Error("Index out of bounds");
        }
        return this.representations[index];
    }

    punch() {
        this.isPunched = true;
    }

    getLastRepresentation() {
        return this.representations.at(-1);
    }
}