export default class Point {
    #z;
    constructor(x, y, z=[0]) {
        this.x = x; // X coordinate of the point
        this.y = y; // Y coordinate of the point
        this.#z = z; // Z coordinate of the point, default is 0
    }

    get z() {
        return Math.max(this.#z)
    }

    reflectAcrossFold(fold, maxZIndex=0) {
        let reflectedPoint;
        const newZIndex = this.#z.map((zIndex) => maxZIndex - zIndex - 1); // Calculate new z-index after reflection
        if (fold.isHorizontal) {
            reflectedPoint = this.#horizontalReflection(fold.intercept, fold.leftFold, newZIndex);
        } else if (fold.isVertical) {
            reflectedPoint = this.#verticalReflection(fold.intercept, fold.leftFold, newZIndex);
        } else {
            reflectedPoint = this.#diagonalReflection(fold.slope, fold.intercept, fold.leftFold, newZIndex);
        }

        return reflectedPoint;
    }

    equals2D(other) {
        if (!(other instanceof Point)) {
            return false;
        }
        return this.x === other.x && this.y === other.y; // Compare only x and y coordinates
    }

    equals(other) {
        if (!(other instanceof Point)) {
            return false;
        }
        return this.x === other.x && this.y === other.y && this.z === other.z; // Compare x, y, and z coordinates
    }

    #horizontalReflection(intercept, downward, newZIndex) {
        if (intercept < 0 || intercept > 3) {
            throw new Error("Intercept must be between 0 and 3");
        }

        if (this.y >= intercept && downward) {
            return new Point(this.x, intercept - (this.y - intercept), newZIndex);
        }else if (this.y <= intercept && !downward) {
            return new Point(this.x, intercept + (intercept - this.y), newZIndex);
        } else {
            return this; // No change if on the fold line
        }
    }

    #verticalReflection(intercept, leftFold, newZIndex) {
        if (intercept < 0 || intercept > 3) {
            throw new Error("Intercept must be between 0 and 3");
        }

        if (this.x >= intercept && leftFold) {
            return new Point(intercept - (this.x - intercept), this.y, newZIndex);
        } else if (this.x <= intercept && !leftFold) {
            return new Point(intercept + (intercept - this.x), this.y, newZIndex);
        } else {
            return this;
        }
    }

    #diagonalReflection(slope, intercept, leftFold, newZIndex) {
        if (slope === 0) {
            return this.#horizontalReflection(intercept);
        } else if (slope === Infinity) {
            return this.#verticalReflection(intercept);
        }

        const perpindicularSlope = -1 / slope;
        const perpindicularIntercept = this.y - perpindicularSlope * this.x;
        const intersectionX = (perpindicularIntercept - intercept) / (slope - perpindicularSlope);
        const intersectionY = slope * intersectionX + intercept;
        const reflectedX = 2 * intersectionX - this.x;
        const reflectedY = 2 * intersectionY - this.y;

        if (reflectedX < this.x && leftFold){
            return new Point(reflectedX, reflectedY, newZIndex);
        } else if (reflectedX > this.x && !leftFold) {
            return new Point(reflectedX, reflectedY, newZIndex);
        } else {
            if (reflectedX === this.x) {
                this.#z.forEach((zIndex) => {
                    newZIndex.push(zIndex);
                });
                return new Point(this.x, this.y, newZIndex);
            }
            return this;
        }
    }

    get zArray() {
        return this.#z;
    }

    toString() {
        return `Point(${this.x}, ${this.y})`;
    }

    fromString(str) {
        const match = str.match(/Point\((\d+), (\d+)\)/);
        if (!match) {
            throw new Error("Invalid point string format");
        }
        return new Point(parseFloat(match[1]), parseFloat(match[2]));
    }
}