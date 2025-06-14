import Fold from './Fold.js';
import CellRepresentation from './CellRepresentation.js';
import Orientation from '../enums/Orientation.js';
import Point from './Point.js';
import Cell from './Cell.js';

export default class Paper {
    constructor() {
        this.folds = [];
        this.cells = [];
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                const point = new Point(x, y);
                this.cells.push(new Cell(point));
            }
        }
    }

    checkFoldIsValid(fold) {
        if (!(fold instanceof Fold)) {
            throw new Error("Invalid fold object");
        }

        let isValid = 0;

        for (const cell of this.cells) {
            const oldRepresentation = cell.getLastRepresentation();
            const newRepresentation = oldRepresentation.reflectAcrossFold(fold, Math.pow(2, this.folds.length+1));

            if (fold.isHorizontal) {
                const [isValidFold, pointsMoved] = this.#checkHorizontalFold(fold, newRepresentation, oldRepresentation);
                if (!isValidFold) {
                    return false; // Invalid fold, point is out of bounds
                }
                isValid += pointsMoved;
            } else if (fold.isVertical) {
                const [isValidFold, pointsMoved] = this.#checkVerticalFold(fold, newRepresentation, oldRepresentation);
                if (!isValidFold) {
                    return false; // Invalid fold, point is out of bounds
                }
                isValid += pointsMoved;
            } else {
                const [isValidFold, pointsMoved] = this.#checkDiagonalFold(fold, newRepresentation, oldRepresentation);
                if (!isValidFold) {
                    return false; // Invalid fold, point is out of bounds
                }
                isValid += pointsMoved;
            }
        }
        return isValid > 0; // At least one point must be valid;
    }

    #checkHorizontalFold(fold, newRepresentation, oldRepresentation) {
        // Alias for downward fold
        if (fold.leftFold) {
            if (newRepresentation.center.y < oldRepresentation.center.y) {
                return [!(newRepresentation.isOutOfBounds()), 1];
            } else {
                return [true, 0];
            }
        } else {
            if (newRepresentation.center.y > oldRepresentation.center.y) {
                return [!(newRepresentation.isOutOfBounds()), 1];
            }
            else {
                return [true, 0];
            }
        }
    }

    #checkVerticalFold(fold, newRepresentation, oldRepresentation) {
        // Alias for left fold
        if (fold.leftFold) {
            if (newRepresentation.center.x < oldRepresentation.center.x) {
                return [!(newRepresentation.isOutOfBounds()), 1];
            }
            else {
                return [true, 0];
            }
        }
        else {
            if (newRepresentation.center.x > oldRepresentation.center.x) {
                return [!(newRepresentation.isOutOfBounds()), 1];
            } else {
                return [true, 0];
            }
        }
    }

    #checkDiagonalFold(fold, newRepresentation, oldRepresentation) {
        if (fold.leftFold) {
            if (newRepresentation.center.x < oldRepresentation.center.x) {
                return [!(newRepresentation.isOutOfBounds()), 1];
            } else {
                return [true, 0];
            }
        } else {
            if (newRepresentation.center.x > oldRepresentation.center.x) {
                return [!(newRepresentation.isOutOfBounds()), 1];
            } else {
                return [true, 0];
            }
        }
    }

    getCells() {
        return this.cells;
    }

    addFold(fold) {
        if (!(fold instanceof Fold)) {
            throw new Error("Invalid fold object");
        }
        this.folds.push(fold);
        this.#performFold(fold);
    }

    #performFold(fold) {
        for (const cell of this.cells) {
            const oldRepresentation = cell.getLastRepresentation();
            const newRepresentation = oldRepresentation.reflectAcrossFold(this.folds.at(-1), Math.pow(2, this.folds.length));
            if (fold.isHorizontal) {
                cell.addRepresentation(this.#performHorizontalFold(fold, newRepresentation, oldRepresentation));
            } else if (fold.isVertical) {
                cell.addRepresentation(this.#performVerticalFold(fold, newRepresentation, oldRepresentation));
            } else {
                cell.addRepresentation(this.#performDiagonalFold(fold, newRepresentation, oldRepresentation));
            }
        }
    }


    #performHorizontalFold(fold, newRepresentation, oldRepresentation) {
        // Alias for downward fold
        if (fold.leftFold) {
            if (newRepresentation.center.y < oldRepresentation.center.y) {
                return newRepresentation;
            } else {
                return oldRepresentation;
            }
        } else {
            if (newRepresentation.center.y > oldRepresentation.center.y) {
                return newRepresentation;
            }
            else {
                return oldRepresentation;
            }
        }
    }

    #performVerticalFold(fold, newRepresentation, oldRepresentation) {
        // Alias for left fold
        if (fold.leftFold) {
            if (newRepresentation.center.x < oldRepresentation.center.x) {
                return newRepresentation;
            } else {
                return oldRepresentation;
            }
        } else {
            if (newRepresentation.center.x > oldRepresentation.center.x) {
                return newRepresentation;
            } else {
                return oldRepresentation;
            }
        }
    }

    #performDiagonalFold(fold, newRepresentation, oldRepresentation) {
        if (fold.leftFold) {
            if (newRepresentation.center.x <= oldRepresentation.center.x) {
                return newRepresentation;
            } else {
                return oldRepresentation;
            }
        } else {
            if (newRepresentation.center.x >= oldRepresentation.center.x) {
                return newRepresentation
            } else {
                return oldRepresentation;
            }
        }
    }


    punch(point) {
        for (const cell of this.cells) {
            if (cell.getLastRepresentation().center.equals2D(point)) {
                cell.punch();
            }
        }
    }

    getCellsAtFold(foldIndex) {
        if (foldIndex < 0 || foldIndex >= this.folds.length + 1) {
            console.error("Fold index out of bounds:", foldIndex, "Folds length:", this.folds.length);
            throw new Error("Fold index out of bounds");
        }
        const cellsAtFold = {};
        for (const cell of this.cells) {
            const representation = cell.getRepresentationAt(foldIndex);
            if (!cellsAtFold[representation.center.toString()]) {
                cellsAtFold[representation.center.toString()] = [];
            }
            cellsAtFold[representation.center.toString()].push([cell.isPunched, representation]);
        }
        return cellsAtFold;
    }
}