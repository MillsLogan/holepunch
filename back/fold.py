from abc import ABC, abstractmethod
from point import Point

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
        self.downward: bool = downward
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