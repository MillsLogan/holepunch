from point import Point
from orientation import Orientation

class Cell:
    def __init__(self, origin: Point):
        self.origin: Point = origin
        self.locations: list[CellRepresentation] = [CellRepresentation(origin)]
        self.is_punched: bool = False

    def add_location(self, cell_representation: 'CellRepresentation'):
        if not isinstance(cell_representation, CellRepresentation):
            raise TypeError("cell_representation must be an instance of CellRepresentation")
        if self.locations[-1].is_halved and not cell_representation.is_halved:
            cell_representation.is_halved = True  # Ensure halved state is maintained
        self.locations.append(cell_representation)

    def get_location_at(self, index: int) -> 'CellRepresentation':
        if index < 0 or index >= len(self.locations):
            raise IndexError("Index out of bounds for cell locations")
        return self.locations[index]

    def punch(self):
        self.is_punched = True

    def __repr__(self):
        return f"Cell(origin={self.origin}, location={self.locations}, is_punched={self.is_punched})"
    
    def __str__(self):
        return f"Cell at {self.locations} (origin={self.origin}), punched={self.is_punched}"
    
class CellRepresentation:
    def __init__(self, point: Point, 
                 orientation: Orientation = Orientation.TOP_LEFT, 
                 is_halved: bool = False,
                 z_index: list[int] = 0):
        self.point = point
        self.orientation = orientation
        self.is_halved = is_halved
        self._z_index = z_index

    @property
    def z_index(self) -> int:
        if isinstance(self._z_index, list):
            return max(self._z_index)
        return self._z_index
    
    @property
    def z_indexes(self) -> list[int]:
        if isinstance(self._z_index, list):
            return self._z_index
        return [self._z_index]
    
    def get_top_left(self) -> tuple[float, float]:
        print(self.orientation)
        if self.is_halved and self.orientation == Orientation.BOTTOM_RIGHT:
            return None
            
        return (self.point.x - 0.5, self.point.y + 0.5)
    
    def get_top_right(self) -> tuple[float, float]:
        if self.is_halved and self.orientation == Orientation.BOTTOM_LEFT:
            return None
            
        return (self.point.x + 0.5, self.point.y + 0.5)
    
    def get_bottom_left(self) -> tuple[float, float]:
        if self.is_halved and self.orientation == Orientation.TOP_RIGHT:
            return None
            
        return (self.point.x - 0.5, self.point.y - 0.5)
    
    def get_bottom_right(self) -> tuple[float, float]:
        if self.is_halved and self.orientation == Orientation.TOP_LEFT:
            return None
        return (self.point.x + 0.5, self.point.y - 0.5)