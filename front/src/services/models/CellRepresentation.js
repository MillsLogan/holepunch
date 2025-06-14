import { ChevronsLeftRightEllipsis } from 'lucide-react';
import Point from './Point.js';

export default class CellRepresentation {
    #center;
    #topLeft;
    #topRight;
    #bottomLeft;
    #bottomRight;

    constructor(center, topLeft=null, topRight=null, bottomLeft=null, bottomRight=null) {
        this.#center = center; // Center point of the cell
        this.#topLeft = topLeft ?? new Point(center.x - 0.5, center.y - 0.5);
        this.#topRight = topRight ?? new Point(center.x + 0.5, center.y - 0.5);
        this.#bottomLeft = bottomLeft ?? new Point(center.x - 0.5, center.y + 0.5);
        this.#bottomRight = bottomRight ?? new Point(center.x + 0.5, center.y + 0.5);
    }

    reflectAcrossFold(fold, maxZIndex=0) {
        const reflectedCenter = this.#center.reflectAcrossFold(fold, maxZIndex);
        const reflectedTopLeft = this.#topLeft.reflectAcrossFold(fold, maxZIndex);
        const reflectedTopRight = this.#topRight.reflectAcrossFold(fold, maxZIndex);
        const reflectedBottomLeft = this.#bottomLeft.reflectAcrossFold(fold, maxZIndex);
        const reflectedBottomRight = this.#bottomRight.reflectAcrossFold(fold, maxZIndex);

        return new CellRepresentation(
            reflectedCenter,
            reflectedTopLeft,
            reflectedTopRight,
            reflectedBottomLeft,
            reflectedBottomRight
        );
    }

    get zIndex() {
        return Math.max(
            this.#topLeft.z,
            this.#topRight.z,
            this.#bottomLeft.z,
            this.#bottomRight.z,
            this.#center.z
        ); // Returns the maximum z-index of the cell's corners
    }

    get topLeft() {
        return this.#topLeft; // Top-left point of the cell
    }

    get topRight() {
        return this.#topRight; // Top-right point of the cell
    }

    get bottomLeft() {
        return this.#bottomLeft; // Bottom-left point of the cell
    }

    get bottomRight() {
        return this.#bottomRight; // Bottom-right point of the cell
    }

    get center() {
        return this.#center; // Center point of the cell
    }

    isOutOfBounds(xMin=-0.5, xMax=3.5, yMin=-0.5, yMax=3.5) {
        return (
            this.#topLeft.x < xMin || this.#topLeft.x > xMax ||
            this.#topLeft.y < yMin || this.#topLeft.y > yMax ||

            this.#topRight.x < xMin || this.#topRight.x > xMax ||
            this.#topRight.y < yMin || this.#topRight.y > yMax ||

            this.#bottomLeft.x < xMin || this.#bottomLeft.x > xMax ||
            this.#bottomLeft.y < yMin || this.#bottomLeft.y > yMax ||

            this.#bottomRight.x < xMin || this.#bottomRight.x > xMax ||
            this.#bottomRight.y < yMin || this.#bottomRight.y > yMax
        );
    }
}