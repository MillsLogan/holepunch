from cell import Cell, CellRepresentation
from point import Point
from fold import Fold, DiagonalFold, HorizontalFold, VerticalFold
from orientation import Orientation
import math

class Paper:
    def __init__(self):
        self.folds: list[Fold] = []
        self.punches: list[Point] = []
        self.cells: dict[Point, Cell] = {Point(x, y): Cell(Point(x, y)) for y in range(4) for x in range(4)} 
        self.layers: list[list[list[Cell]]] = [[[cell for cell in self.cells.values()]]]

    def add_fold(self, fold: Fold):
        if not isinstance(fold, Fold):
            raise TypeError("Fold must be an instance of Fold class")
        self.layers.append([])
        self.folds.append(fold)
        print(f"Adding fold: {fold}")
        self._perform_fold(fold)
        print(f"Fold performed: {fold}")

    def _find_new_z_index(self, current_index: int, halving: bool = False) -> int:
        max_z_index = 2**len(self.folds)
        if len(current_index) == 2:
            return [max_z_index - current_index[0] - 1, max_z_index - current_index[1] - 1]
        elif halving:
            return [current_index[0], max_z_index - current_index[0] - 1]
        return [max_z_index - math.floor(current_index[0]) - 1]

    def _perform_horizontal_fold(self, fold: HorizontalFold, reflected_point: Point, old_location: CellRepresentation):
        # This assumes horizontal folds never fold on a cell's location
        if fold.downward:
            # Here, downward means the greater y values are folded down
            if reflected_point.y < old_location.point.y:
                # If the reflected point is above the old location, we reflect it, and increase the z-index
                new_location = CellRepresentation(reflected_point, orientation=old_location.orientation.horizontal_flip(), z_index=self._find_new_z_index(old_location.z_indexes))
                return new_location
            else:
                # If the reflected point is below the old location, we keep the old location
                return old_location
        else:
            # Here, upward means the lesser y values are folded up
            if reflected_point.y > old_location.point.y:
                # If the reflected point is below the old location, we reflect it, and increase the z-index
                new_location = CellRepresentation(reflected_point, orientation=old_location.orientation.horizontal_flip(), z_index=self._find_new_z_index(old_location.z_indexes))
                return new_location
            else:
                # If the reflected point is above the old location, we keep the old location
                return old_location
            
    def _perform_vertical_fold(self, fold: VerticalFold, reflected_point: Point, old_location: CellRepresentation):
        # This assumes vertical folds never fold on a cell's location
        if fold.left_fold:
            # Here, left fold means the greater x values are folded left
            if reflected_point.x < old_location.point.x:
                # If the reflected point is to the left of the old location, we reflect it, and increase the z-index
                new_location = CellRepresentation(reflected_point, orientation=old_location.orientation.vertical_flip(), z_index=self._find_new_z_index(old_location.z_indexes))
                
                return new_location
            else:
                # If the reflected point is to the right of the old location, we keep the old location
                return old_location
        else:
            # Here, right fold means the lesser x values are folded right
            if reflected_point.x > old_location.point.x:
                # If the reflected point is to the right of the old location, we reflect it, and increase the z-index
                new_location = CellRepresentation(reflected_point, orientation=old_location.orientation.vertical_flip(), z_index=self._find_new_z_index(old_location.z_indexes))
                return new_location
            else:
                # If the reflected point is to the left of the old location, we keep the old location
                return old_location
            
    def _perform_diagonal_fold(self, fold: DiagonalFold, reflected_point: Point, old_location: CellRepresentation):
        # Diagonal folds are more complex, we need to determine the orientation based on the fold line
        if fold.left_fold:
            # Left diagonal fold, moving points to the right of the fold line left, (x < y)
            if reflected_point.x == old_location.point.x:
                # If the reflected point is on the fold line, we keep the old location
                # Need to figure out if the diagonal is positive or negative
                if fold.fold_line[0] < 0:
                    # If the fold line is negative, and we are folding left, the orientation is BOTTOM_LEFT
                    return CellRepresentation(reflected_point, is_halved=True, orientation=Orientation.BOTTOM_LEFT, z_index=self._find_new_z_index(old_location.z_indexes, True))
                else:
                    # If the fold line is positive, and we are folding left, the orientation is TOP_LEFT
                    return CellRepresentation(reflected_point, is_halved=True, orientation=Orientation.TOP_LEFT, z_index=self._find_new_z_index(old_location.z_indexes, True))
            elif reflected_point.x < old_location.point.x:
                return CellRepresentation(reflected_point, z_index=self._find_new_z_index(old_location.z_indexes))
            else:
                return old_location
        else:
            # Right diagonal fold, moving points to the left of the fold line right, (x > y)
            if reflected_point.x == old_location.point.x:
                if fold.fold_line[0] < 0:
                    # If the fold line is negative, and we are folding left, the orientation is TOP_RIGHT
                    return CellRepresentation(reflected_point, is_halved=True, orientation=Orientation.TOP_RIGHT, z_index=self._find_new_z_index(old_location.z_indexes, True))
                else:
                    # If the fold line is positive, and we are folding left, the orientation is TOP_LEFT
                    return CellRepresentation(reflected_point, is_halved=True, orientation=Orientation.BOTTOM_RIGHT, z_index=self._find_new_z_index(old_location.z_indexes, True))
            elif reflected_point.x > old_location.point.x:
                return CellRepresentation(reflected_point, z_index=self._find_new_z_index(old_location.z_indexes))
            else:
                return old_location
        
    def _perform_fold(self, fold: Fold):
        for cell in self.cells.values():
            old_location = cell.locations[-1]
            reflected_point = old_location.point.reflect_point(fold)
            
            if fold.horizontal:
                cell.add_location(self._perform_horizontal_fold(fold, reflected_point, old_location))
            elif fold.vertical:
                cell.add_location(self._perform_vertical_fold(fold, reflected_point, old_location))
            elif isinstance(fold, DiagonalFold):
                cell.add_location(self._perform_diagonal_fold(fold, reflected_point, old_location))
            else:
                raise ValueError("Unknown fold type")

    def punch(self, point: Point):
        for cell in self.cells.values():
            if point == cell.locations[-1].point:
                cell.punch()

    def __str__(self):
        for y in range(4):
            for x in range(4):
                cell = self.cells[Point(x, y)]
                if cell.is_punched:
                    print("X", end=" | ")
                else:
                    print(" ", end=" | ")
            print()
        return ""

    def get_cells_at_fold(self, fold_index: int) -> dict[Point, list[tuple[bool, CellRepresentation]]]:
        if fold_index < 0 or fold_index >= len(self.folds) + 1:
            raise ValueError(f"Fold index {fold_index} is out of bounds")
        
        cells_at_fold: dict[Point, list[CellRepresentation]] = {}
        
        for cell in self.cells.values():
            cell_representation = cell.get_location_at(fold_index)
            if cell_representation.point not in cells_at_fold:
                cells_at_fold[cell_representation.point] = []
            cells_at_fold[cell_representation.point].append((cell.is_punched, cell_representation))
        
        return cells_at_fold