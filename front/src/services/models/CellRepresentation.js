import Orientation from '../enums/Orientation.js';
import Point from './Point.js';

export default class CellRepresentation {
    #zIndex;

    constructor(point, orientation=Orientation.TOP_LEFT, isHalved=false, zIndex=[0]) {
        this.point = point; // Point object representing the cell's position
        this.orientation = orientation; // Orientation of the representation
        this.isHalved = isHalved; // Indicates if the representation is halved
        this.#zIndex = zIndex; // Array of z-index values for layering
    }

    get zIndex() {
        return Math.max(...this.#zIndex);
    }

    get zIndexArray() {
        return this.#zIndex;
    }
    
    // 0, 0 is the top left corner of an html canvas
    get topLeft() {
        if (this.isHalved && this.orientation === Orientation.BOTTOM_RIGHT) {
            return this.bottomLeft;
        }

        return new Point(this.point.x - 0.5, this.point.y - 0.5);
    }

    get bottomRight() {
        if (this.isHalved && this.orientation === Orientation.TOP_LEFT) {
            return this.bottomLeft;
        }

        return new Point(this.point.x + 0.5, this.point.y + 0.5);
    }

    get bottomLeft() {
        if (this.isHalved && this.orientation === Orientation.TOP_RIGHT) {
            return this.topLeft;
        }

        return new Point(this.point.x - 0.5, this.point.y + 0.5);
    }

    get topRight() {
        if (this.isHalved && this.orientation === Orientation.BOTTOM_LEFT) {
            return this.topLeft;
        }

        return new Point(this.point.x + 0.5, this.point.y - 0.5);
    }
}