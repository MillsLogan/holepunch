class Point:    
    def __init__(self, x: int, y: int):
        self.x: int = int(x)
        self.y: int = int(y)

    def reflect_point(self, fold: 'Fold') -> 'Point':
        from fold import DiagonalFold
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