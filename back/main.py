from abc import ABC, abstractmethod
import matplotlib.pyplot as plt


class Point:
    def __init__(self, x: int, y: int):
        self.x: int = int(x)
        self.y: int = int(y)

    def reflect_point(self, fold: 'Fold') -> 'Point':
        if fold.horizontal:
            return self.horizontal_reflect(fold.fold_line[1])
        elif fold.vertical:
            return self.vertical_reflect(fold.fold_line[1])
        elif isinstance(fold, DiagonalFold):
            return self.diagonal_reflect(fold.fold_line)
        else:
            raise ValueError("Unknown fold type")
        return self

    def horizontal_reflect(self, fold_line: int) -> 'Point':
        if not 0 <= fold_line <= 3:
            raise ValueError(f"Fold line {fold_line} must be between 0 and 3")
        if self.y > fold_line:
            reflected_y = fold_line - (self.y - fold_line)
            print(f"Reflecting point {self} across horizontal fold line {fold_line} results in reflected point ({self.x}, {reflected_y})")
            return Point(self.x, reflected_y)
        else:
            reflected_y = fold_line + (fold_line - self.y)
            print(f"Reflecting point {self} across horizontal fold line {fold_line} results in reflected point ({self.x}, {reflected_y})")
            return Point(self.x, reflected_y)
        return self
    
    def vertical_reflect(self, fold_line: int) -> 'Point':
        if not 0 <= fold_line <= 3:
            raise ValueError(f"Fold line {fold_line} must be between 0 and 3")
        if self.x > fold_line:
            reflected_x = fold_line - (self.x - fold_line)
            print(f"Reflecting point {self} across vertical fold line {fold_line} results in reflected point ({reflected_x}, {self.y})")
            return Point(reflected_x, self.y)
        else:
            reflected_x = fold_line + (fold_line - self.x)
            print(f"Reflecting point {self} across vertical fold line {fold_line} results in reflected point ({reflected_x}, {self.y})")
            return Point(reflected_x, self.y)
        return self

    def diagonal_reflect(self, fold_line: tuple[int, int]) -> 'Point':
        slope, intercept = fold_line
        # Diagonal fold
        perp_slope = -1 / slope if slope != 0 else float('inf')
        perp_intercept = self.y - perp_slope * self.x
        intersection_x = (perp_intercept - intercept) / (slope - perp_slope) if slope != perp_slope else self.x
        intersection_y = slope * intersection_x + intercept
        reflected_x = 2 * intersection_x - self.x
        reflected_y = 2 * intersection_y - self.y
        print(f"Reflecting point {self} across fold line {fold_line} results in reflected point ({reflected_x}, {reflected_y})")
        if reflected_x < 0 or reflected_x > 3 or reflected_y < 0 or reflected_y > 3:
            print(f"Warning: Reflected point {reflected_x}, {reflected_y} is out of bounds (0-3)")
            return self
        return Point(int(reflected_x), int(reflected_y))

    def __hash__(self):
        return hash((self.x, self.y))
    
    def __str__(self):
        return f"Point({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Point({self.x}, {self.y})"
    
    def __eq__(self, other):
        if isinstance(other, Point):
            return self.x == other.x and self.y == other.y
        return False
            

class Fold(ABC):
    def __init__(self, left_fold: bool = True, horizontal: bool = False, vertical: bool = False):
        self.left_fold: bool = left_fold
        self.horizontal: bool = horizontal
        self.vertical: bool = vertical
        self.fold_line: tuple[int, int] = self._compute_fold_line()

    @abstractmethod
    def _compute_fold_line(self) -> tuple[int, int]:
        pass
    
class DiagonalFold(Fold):
    def __init__(self, start: Point, end: Point, left_fold: bool = True):
        if not (start.x != end.x and start.y != end.y):
            raise ValueError("Diagonal fold must have different x and y coordinates")
        self.start = start
        self.end = end
        super().__init__(left_fold=left_fold, horizontal=False, vertical=False)
        
    def _compute_fold_line(self) -> tuple[int, int]:
        # Diagonal fold
        slope = (self.end.y - self.start.y) / (self.end.x - self.start.x) if self.end.x != self.start.x else 0
        intercept = self.start.y - slope * self.start.x if slope != float('inf') else self.start.x
        return (slope, intercept)

class HorizontalFold(Fold):
    def __init__(self, fold_line: int, downward: bool = True):
        self.fold_on: int = fold_line
        super().__init__(horizontal=True, vertical=False, left_fold=downward)
        
    
    def _compute_fold_line(self) -> tuple[int, int]:
        if not 0 <= self.fold_on <= 3:
            raise ValueError(f"Fold line {self.fold_on} must be between 0 and 3")
        return (0, self.fold_on)

class VerticalFold(Fold):
    def __init__(self, fold_line: int, left_fold: bool = True):
        self.fold_on: int = fold_line
        super().__init__(horizontal=False, vertical=True, left_fold=left_fold)
    
    def _compute_fold_line(self) -> tuple[int, int]:
        if not 0 <= self.fold_on <= 3:
            raise ValueError(f"Fold line {self.fold_on} must be between 0 and 3")
        return (1, self.fold_on)

class Cell:
    def __init__(self, origin: Point):
        self.locations: list[Point] = [origin]
        self.origin: Point = origin
        self.is_punched = False

    def punch(self):
        self.is_punched = True
        
    def __repr__(self):
        return f"Cell(origin={self.origin}, location={self.locations}, is_punched={self.is_punched})"
    
    def __str__(self):
        return f"Cell at {self.locations} (origin={self.origin}), punched={self.is_punched}"

class Paper:
    def __init__(self):
        self.folds: list[Fold] = []
        self.punches: list[Point] = []
        self.cells: dict[Point, Cell] = {Point(x, y): Cell(Point(x, y)) for y in range(4) for x in range(4)} 

    def add_fold(self, fold: Fold):
        if not isinstance(fold, Fold):
            raise TypeError("Fold must be an instance of Fold class")
        self.folds.append(fold)
        print(f"Adding fold: {fold}")
        self._perform_fold(fold)
        print(f"Fold performed: {fold}")
        
    def _perform_fold(self, fold: Fold):
        for cell in self.cells.values():
            old_location = cell.locations[-1]
            reflected_point = old_location.reflect_point(fold)
            
            if fold.horizontal:
                # If the fold is horizontal, we need to reflect the y-coordinate
                # Check if the fold is downward or upward
                if fold.left_fold:
                    # Downward fold (moveing points above the fold line down)
                    if reflected_point.y < old_location.y:
                        cell.locations.append(reflected_point)
                    else:
                        # Ignore points below the fold line, they remain unchanged
                        cell.locations.append(old_location)
                else:
                    # Upward fold (moving points below the fold line up)
                    if reflected_point.y > old_location.y:
                        cell.locations.append(reflected_point)
                    else:
                        # Ignore points above the fold line, they remain unchanged
                        cell.locations.append(old_location)
            elif fold.vertical:
                # If the fold is vertical, we need to reflect the x-coordinate
                if fold.left_fold:
                    # Left fold (moving points to the right of the fold line left)
                    if reflected_point.x < old_location.x:
                        cell.locations.append(reflected_point)
                    else:
                        # Ignore points to the left of the fold line, they remain unchanged
                        cell.locations.append(old_location)
                else:
                    # Right fold (moving points to the left of the fold line right)
                    if reflected_point.x > old_location.x:
                        cell.locations.append(reflected_point)
                    else:
                        # Ignore points to the right of the fold line, they remain unchanged
                        cell.locations.append(old_location)
            elif isinstance(fold, DiagonalFold):
                # If the fold is diagonal, we need to reflect both x and y coordinates
                if fold.left_fold:
                    # Left diagonal fold, moving points to the right of the fold line left, (x < y)
                    if reflected_point.x <= old_location.x:
                        cell.locations.append(reflected_point)
                    else:
                        # Ignore points to the right of the fold line, they remain unchanged
                        cell.locations.append(old_location)
                else:
                    # Right diagonal fold, moving points to the left of the fold line right, (x > y)
                    if reflected_point.x >= old_location.x:
                        cell.locations.append(reflected_point)
                    else:
                        # Ignore points to the left of the fold line, they remain unchanged
                        cell.locations.append(old_location)
            else:
                raise ValueError("Unknown fold type")

    def punch(self, point: Point):
        for cell in self.cells.values():
            if point == cell.locations[-1]:
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

    def get_cells_at_fold(self, fold_index: int) -> dict[Point, list[Cell]]:
        if fold_index < 0 or fold_index >= len(self.folds) + 1:
            raise ValueError(f"Fold index {fold_index} is out of bounds")
        
        cells_at_fold: dict[Point, list[Cell]] = {}
        
        for cell in self.cells.values():
            for location in cell.locations:
                cell_location = cell.locations[fold_index]
                if cell_location not in cells_at_fold:
                    cells_at_fold[cell_location] = []
                cells_at_fold[cell_location].append(cell)
        
        return cells_at_fold
    
def display_fold(fold: Fold, axis):
    if fold.horizontal:
        axis.axhline(y=fold.fold_line[1], color='green', linestyle='--', label='Horizontal Fold')
    elif fold.vertical:
        axis.axvline(x=fold.fold_line[1], color='orange', linestyle='--', label='Vertical Fold')
    elif isinstance(fold, DiagonalFold):
        x_values = [fold.start.x, fold.end.x]
        y_values = [fold.start.y, fold.end.y]
        axis.plot(x_values, y_values, color='purple', linestyle='--', label='Diagonal Fold')
    else:
        raise ValueError("Unknown fold type")

def display_paper(cells: dict[Point, list[Cell]], axis):
    for point, cell_location in cells.items():
        for cell in cell_location:
            if cell.is_punched:
                axis.plot(point.x, point.y, marker='s', color='red', markersize=25, label='Punched', alpha=0.2)
            else:
                axis.plot(point.x, point.y, marker='s', color='blue', markersize=25, label='Punched', alpha=0.2)
        
        
    axis.set_xlim(-0.5, 3.5)
    axis.set_ylim(-0.5, 3.5)
    axis.set_xticks(range(4))
    axis.set_yticks(range(4))
    axis.grid(True)
    axis.set_title("Paper Folding Visualization")
    axis.set_xlabel("X-axis")
                
if __name__ == "__main__":
    fig, ax = plt.subplots(1,4, figsize=(25, 6))
    
    paper = Paper()
    fold1 = DiagonalFold(Point(0, 0), Point(3, 3), left_fold=True)
    paper.add_fold(fold1)
    print("Diagonal fold added:", fold1)
    fold2 = HorizontalFold(2.5, downward=True)

    paper.add_fold(fold2)
    fold3 = VerticalFold(1.5, left_fold=False)
    paper.add_fold(fold3)
    paper.punch(Point(3, 1))
    
    display_paper(paper.get_cells_at_fold(0), ax[0])
    display_fold(fold1, ax[0])

    display_paper(paper.get_cells_at_fold(1), ax[1])
    display_fold(fold2, ax[1])
    display_paper(paper.get_cells_at_fold(2), ax[2])
    display_fold(fold3, ax[2])
    display_paper(paper.get_cells_at_fold(3), ax[3])
    
    
    plt.show()
    print("Visualization complete.")