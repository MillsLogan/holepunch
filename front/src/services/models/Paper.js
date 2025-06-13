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
            const reflectedPoint = oldRepresentation.point.reflectAcrossFold(fold);

            if (fold.isHorizontal) {
                const [isValidFold, pointsMoved] = this.#checkHorizontalFold(fold, reflectedPoint, oldRepresentation);
                if (!isValidFold) {
                    return false; // Invalid fold, point is out of bounds
                }
                isValid += pointsMoved;
            } else if (fold.isVertical) {
                const [isValidFold, pointsMoved] = this.#checkVerticalFold(fold, reflectedPoint, oldRepresentation);
                if (!isValidFold) {
                    return false; // Invalid fold, point is out of bounds
                }
                isValid += pointsMoved;
            } else {
                const [isValidFold, pointsMoved] = this.#checkDiagonalFold(fold, reflectedPoint, oldRepresentation);
                if (!isValidFold) {
                    return false; // Invalid fold, point is out of bounds
                }
                isValid += pointsMoved;
            }
        }
        return isValid > 0; // At least one point must be valid;
    }

    #checkHorizontalFold(fold, reflectedPoint, oldRepresentation) {
        // Alias for downward fold
        if (fold.leftFold) {
            if (reflectedPoint.y < oldRepresentation.point.y) {
                return [!(reflectedPoint.y < 0 || reflectedPoint.y > 3), 1];
            } else {
                return [true, 0];
            }
        } else {
            if (reflectedPoint.y > oldRepresentation.point.y) {
                return [!(reflectedPoint.y < 0 || reflectedPoint.y > 3), 1];
            }
            else {
                return [true, 0];
            }
        }
    }

    #checkVerticalFold(fold, reflectedPoint, oldRepresentation) {
        // Alias for left fold
        if (fold.leftFold) {
            if (reflectedPoint.x < oldRepresentation.point.x) {
                return [!(reflectedPoint.x < 0 || reflectedPoint.x > 3), 1];
            }
            else {
                return [true, 0];
            }
        }
        else {
            if (reflectedPoint.x > oldRepresentation.point.x) {
                return [!(reflectedPoint.x < 0 || reflectedPoint.x > 3), 1];
            } else {
                return [true, 0];
            }
        }
    }

    #checkDiagonalFold(fold, reflectedPoint, oldRepresentation) {
        if (fold.leftFold) {
            if (reflectedPoint.x < oldRepresentation.point.x) {
                return [!((reflectedPoint.y < 0 || reflectedPoint.y > 3) || (reflectedPoint.x < 0 || reflectedPoint.x > 3)), 1];
            } else {
                return [true, 0];
            }
        } else {
            if (reflectedPoint.x > oldRepresentation.point.x) {
                return [!((reflectedPoint.y < 0 || reflectedPoint.y > 3) || (reflectedPoint.x < 0 || reflectedPoint.x > 3)), 1];
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
            const reflectedPoint = oldRepresentation.point.reflectAcrossFold(this.folds.at(-1));

            if (fold.isHorizontal) {
                cell.addRepresentation(this.#performHorizontalFold(fold, reflectedPoint, oldRepresentation));
            } else if (fold.isVertical) {
                cell.addRepresentation(this.#performVerticalFold(fold, reflectedPoint, oldRepresentation));
            } else {
                cell.addRepresentation(this.#performDiagonalFold(fold, reflectedPoint, oldRepresentation));
            }
        }
    }


    #performHorizontalFold(fold, reflectedPoint, oldRepresentation) {
        // Alias for downward fold
        if (fold.leftFold) {
            if (reflectedPoint.y < oldRepresentation.point.y) {
                return new CellRepresentation(reflectedPoint, Orientation.HorizontalFlip(oldRepresentation.orientation), false, this.#findNewZIndex(oldRepresentation.zIndexArray));
            } else {
                return oldRepresentation;
            }
        } else {
            if (reflectedPoint.y > oldRepresentation.point.y) {
                return new CellRepresentation(reflectedPoint, Orientation.HorizontalFlip(oldRepresentation.orientation), false, this.#findNewZIndex(oldRepresentation.zIndexArray));
            }
            else {
                return oldRepresentation;
            }
        }
    }

    #performVerticalFold(fold, reflectedPoint, oldRepresentation) {
        // Alias for left fold
        if (fold.leftFold) {
            if (reflectedPoint.x < oldRepresentation.point.x) {
                return new CellRepresentation(reflectedPoint, Orientation.VerticalFlip(oldRepresentation.orientation), false, this.#findNewZIndex(oldRepresentation.zIndexArray));
            } else {
                return oldRepresentation;
            }
        } else {
            if (reflectedPoint.x > oldRepresentation.point.x) {
                return new CellRepresentation(reflectedPoint, Orientation.VerticalFlip(oldRepresentation.orientation), false, this.#findNewZIndex(oldRepresentation.zIndexArray));
            } else {
                return oldRepresentation;
            }
        }
    }

    #performDiagonalFold(fold, reflectedPoint, oldRepresentation) {
        if (fold.leftFold) {
            if (reflectedPoint.x === oldRepresentation.point.x) {
                if (fold.slope < 0) {
                    return new CellRepresentation(reflectedPoint, Orientation.TOP_LEFT, true, this.#findNewZIndex(oldRepresentation.zIndexArray, true));
                } else {
                    return new CellRepresentation(reflectedPoint, Orientation.BOTTOM_LEFT, true, this.#findNewZIndex(oldRepresentation.zIndexArray, true));
                }
            } else if (reflectedPoint.x < oldRepresentation.point.x) {
                return new CellRepresentation(reflectedPoint, oldRepresentation.Orientation, false, this.#findNewZIndex(oldRepresentation.zIndexArray));
            } else {
                return oldRepresentation;
            }
        } else {
            if (reflectedPoint.x === oldRepresentation.point.x) {
                if (fold.slope < 0) {
                    return new CellRepresentation(reflectedPoint, Orientation.BOTTOM_RIGHT, true, this.#findNewZIndex(oldRepresentation.zIndexArray, true));
                } else {
                    return new CellRepresentation(reflectedPoint, Orientation.TOP_RIGHT, true, this.#findNewZIndex(oldRepresentation.zIndexArray, true));
                }
            } else if (reflectedPoint.x > oldRepresentation.point.x) {
                return new CellRepresentation(reflectedPoint, oldRepresentation.Orientation, false, this.#findNewZIndex(oldRepresentation.zIndexArray));
            } else {
                return oldRepresentation;
            }
        }
    }

    #findNewZIndex(oldZIndexArray, isHalved=false) {
        const maxZIndex = Math.pow(2, this.folds.length);
        if (oldZIndexArray.length === 2) {
            return [maxZIndex - oldZIndexArray[0] - 1, maxZIndex - oldZIndexArray[1] - 1];
        } else if (isHalved) {
            return [oldZIndexArray[0], maxZIndex - oldZIndexArray[0] - 1];
        }
        else {
            return [maxZIndex - oldZIndexArray[0] - 1];
        }
    }

    punch(point) {
        for (const cell of this.cells) {
            if (cell.getLastRepresentation().point.equals(point)) {
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
            if (!cellsAtFold[representation.point]) {
                cellsAtFold[representation.point.toString()] = [];
            }
            cellsAtFold[representation.point.toString()].push([cell.isPunched, representation]);
        }
        return cellsAtFold;
    }
}