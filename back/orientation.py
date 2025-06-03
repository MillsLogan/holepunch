from enum import Enum


class Orientation(Enum):
    TOP_LEFT = "top_left"
    TOP_RIGHT = "top_right"
    BOTTOM_LEFT = "bottom_left"
    BOTTOM_RIGHT = "bottom_right"

    def vertical_flip(self):
        if self == Orientation.TOP_LEFT:
            return Orientation.TOP_RIGHT
        elif self == Orientation.TOP_RIGHT:
            return Orientation.TOP_LEFT
        elif self == Orientation.BOTTOM_LEFT:
            return Orientation.BOTTOM_RIGHT
        elif self == Orientation.BOTTOM_RIGHT:
            return Orientation.BOTTOM_LEFT
        else:
            raise ValueError("Unknown orientation for horizontal flip")
        
    def horizontal_flip(self):
        if self == Orientation.TOP_LEFT:
            return Orientation.BOTTOM_LEFT
        elif self == Orientation.TOP_RIGHT:
            return Orientation.BOTTOM_RIGHT
        elif self == Orientation.BOTTOM_LEFT:
            return Orientation.TOP_LEFT
        elif self == Orientation.BOTTOM_RIGHT:
            return Orientation.TOP_RIGHT
        else:
            raise ValueError("Unknown orientation for vertical flip")

    def __str__(self):
        return self.value

    def __repr__(self):
        return f"Orientation.{self.name}"
    
    def __hash__(self):
        return hash(self.value)
    
    def __eq__(self, other):
        if isinstance(other, Orientation):
            return self.value == other.value
        return False
    
    def __ne__(self, other):
        if isinstance(other, Orientation):
            return self.value != other.value
        return True