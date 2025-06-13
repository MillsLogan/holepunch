export default class Point {
    constructor(x, y) {
        this.x = x; // X coordinate of the point
        this.y = y; // Y coordinate of the point
    }

    reflectAcrossFold(fold) {
        if (fold.isHorizontal) {
            return this.#horizontalReflection(fold.intercept);
        } else if (fold.isVertical) {
            return this.#verticalReflection(fold.intercept);
        } else {
            return this.#diagonalReflection(fold.slope, fold.intercept);
        }
    }

    #horizontalReflection(intercept) {
        if (intercept < 0 || intercept > 3) {
            throw new Error("Intercept must be between 0 and 3");
        }

        if (this.y > intercept) {
            return new Point(this.x, intercept - (this.y - intercept));
        }else if (this.y < intercept) {
            return new Point(this.x, intercept + (intercept - this.y));
        } else {
            return new Point(this.x, this.y); // No change if on the fold line
        }
    }

    #verticalReflection(intercept) {
        if (intercept < 0 || intercept > 3) {
            throw new Error("Intercept must be between 0 and 3");
        }

        if (this.x > intercept) {
            return new Point(intercept - (this.x - intercept), this.y);
        } else if (this.x < intercept) {
            return new Point(intercept + (intercept - this.x), this.y);
        } else {
            return new Point(this.x, this.y); // No change if on the fold line
        }
    }

    #diagonalReflection(slope, intercept) {
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
        if (reflectedX < 0 || reflectedX > 3 || reflectedY < 0 || reflectedY > 3) {
            console.warn(`WARNING: Reflected point (${reflectedX}, ${reflectedY}) is out of bounds (0-3).`);
        }
        return new Point(reflectedX, reflectedY);
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

    equals(other) {
        if (!(other instanceof Point)) {
            return false;
        }
        return this.x === other.x && this.y === other.y;
    }
}