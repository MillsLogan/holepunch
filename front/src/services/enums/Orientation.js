export default class Orientation {
    static TOP_LEFT = 'top-left';
    static TOP_RIGHT = 'top-right';
    static BOTTOM_LEFT = 'bottom-left';
    static BOTTOM_RIGHT = 'bottom-right';

    static HorizontalFlip(orientation) {
        switch (orientation) {
            case Orientation.TOP_LEFT:
                return Orientation.BOTTOM_LEFT;
            case Orientation.TOP_RIGHT:
                return Orientation.BOTTOM_RIGHT;
            case Orientation.BOTTOM_LEFT:
                return Orientation.TOP_LEFT;
            case Orientation.BOTTOM_RIGHT:
                return Orientation.TOP_RIGHT;
            default:
                throw new Error("Invalid orientation for horizontal flip");
        }
    }

    static VerticalFlip(orientation) {
        switch (orientation) {
            case Orientation.TOP_LEFT:
                return Orientation.TOP_RIGHT;
            case Orientation.TOP_RIGHT:
                return Orientation.TOP_LEFT;
            case Orientation.BOTTOM_LEFT:
                return Orientation.BOTTOM_RIGHT;
            case Orientation.BOTTOM_RIGHT:
                return Orientation.BOTTOM_LEFT;
            default:
                throw new Error("Invalid orientation for vertical flip");
        }
    }
}