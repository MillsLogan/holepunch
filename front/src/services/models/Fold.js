export default class Fold {
    constructor(leftFold, isHorizontal, isVertical, slope, intercept) {
        this.leftFold = leftFold; // Indicates if the fold is on the left side
        this.isHorizontal = isHorizontal; // Indicates if the fold is horizontal
        this.isVertical = isVertical; // Indicates if the fold is vertical
        this.slope = slope; // Slope of the fold line (if applicable)
        this.intercept = intercept; // Intercept of the fold line (if applicable)
    }

    static HorizontalFold(leftFold, intercept) {
        return new Fold(leftFold, true, false, 0, intercept);
    }

    static VerticalFold(downward, intercept) {
        return new Fold(downward, false, true, Infinity, intercept);
    }

    static DiagonalFold(leftFold, startingPoint, endingPoint) {
        const slope = (endingPoint.y - startingPoint.y) / (endingPoint.x - startingPoint.x);
        const intercept = startingPoint.y - slope * startingPoint.x;
        return new Fold(leftFold, false, false, slope, intercept);
    }
}