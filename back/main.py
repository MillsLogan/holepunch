import matplotlib.pyplot as plt
from cell import Cell, CellRepresentation
from point import Point
from fold import Fold, DiagonalFold, HorizontalFold, VerticalFold
from paper import Paper
from orientation import Orientation
from collections import Counter
import math
from scipy.spatial import ConvexHull
    
def display_fold(fold: Fold, axis):
    if fold.horizontal:
        axis.axhline(y=fold.fold_line[1], color='grey', linestyle='-', label='Horizontal Fold')
    elif fold.vertical:
        axis.axvline(x=fold.fold_line[1], color='grey', linestyle='-', label='Vertical Fold')
    elif isinstance(fold, DiagonalFold):
        if fold.fold_line[0] < 0:
            # Negative slope diagonal fold
            x_values = [fold.start.x + 0.5, fold.end.x - 0.5]
            y_values = [fold.start.y - 0.5, fold.end.y + 0.5]
        else:
            # Positive slope diagonal fold
            x_values = [fold.start.x - 0.5, fold.end.x + 0.5]
            y_values = [fold.start.y + 0.5, fold.end.y - 0.5]
        axis.plot(x_values, y_values, color='grey', linestyle='-', label='Diagonal Fold')
    else:
        raise ValueError("Unknown fold type")

def display_paper(cells: dict[Point, list[tuple[bool, CellRepresentation]]], axis, show_punched: bool=False):
    opacity = 1
    for point, cell_reps in cells.items():
        for is_punched, cell in cell_reps:
            if cell.is_halved:
                if cell.orientation == Orientation.TOP_LEFT:
                    triangle = plt.Polygon([(point.x - 0.5, point.y + 0.5), (point.x + 0.5, point.y + 0.5), (point.x - 0.5, point.y - 0.5)], color='lightgray', alpha=min(1, opacity * 2), label='Halved' if point == list(cells.keys())[0] else "")
                elif cell.orientation == Orientation.TOP_RIGHT:
                    triangle = plt.Polygon([(point.x + 0.5, point.y + 0.5), (point.x - 0.5, point.y + 0.5), (point.x + 0.5, point.y - 0.5)], color='lightgray', alpha=min(1, opacity * 2), label='Halved' if point == list(cells.keys())[0] else "")
                elif cell.orientation == Orientation.BOTTOM_LEFT:
                    triangle = plt.Polygon([(point.x - 0.5, point.y - 0.5), (point.x + 0.5, point.y - 0.5), (point.x - 0.5, point.y + 0.5)], color='lightgray', alpha=min(1, opacity * 2), label='Halved' if point == list(cells.keys())[0] else "")
                elif cell.orientation == Orientation.BOTTOM_RIGHT:
                    triangle = plt.Polygon([(point.x - 0.5, point.y - 0.5), (point.x + 0.5, point.y - 0.5), (point.x + 0.5, point.y + 0.5)], color='lightgray', alpha=min(1, opacity * 2), label='Halved' if point == list(cells.keys())[0] else "")
                axis.add_patch(triangle)
            else:
                rect = plt.Rectangle((point.x - 0.5, point.y - 0.5), 1, 1, color='lightgray', alpha=opacity)
                axis.add_patch(rect)
            if is_punched and show_punched:
                hole = plt.Circle((point.x, point.y), 0.1, color='red', label='Punched' if point == list(cells.keys())[0] else "")
                axis.add_patch(hole)

    axis.set_xlim(-0.5, 3.5)
    axis.set_ylim(-0.5, 3.5)
    axis.set_xticks(range(4))
    axis.set_yticks(range(4))
    axis.set_title("Paper Folding Visualization")
    axis.set_xlabel("X-axis")

def trace_outline(axis, fold_index: int, cells: list[Cell]):
    import numpy as np
    z_index = np.array([math.ceil(cell.get_location_at(fold_index).z_index) for cell in cells])
    max_change = np.max(z_index)
    top_cells = [cell for cell, change in zip(cells, z_index) if math.ceil(change) == max_change]
    # print(cells_with_max_change)
    cell_reps = [cell.get_location_at(fold_index) for cell in top_cells]
    top_lefts = [cell_rep.get_top_left() for cell_rep in cell_reps]
    top_rights = [cell_rep.get_top_right() for cell_rep in cell_reps]
    bottom_lefts = [cell_rep.get_bottom_left() for cell_rep in cell_reps]
    bottom_rights = [cell_rep.get_bottom_right() for cell_rep in cell_reps]
    outline = Counter([*top_lefts, *top_rights, *bottom_lefts, *bottom_rights])
    furthest_left = min([point[0] for point in outline if point is not None])
    furthest_right = max([point[0] for point in outline if point is not None])
    furthest_top = max([point[1] for point in outline if point is not None])
    furthest_bottom = min([point[1] for point in outline if point is not None])
    outline = [point for point in outline if point is not None and (furthest_left == point[0] or furthest_right == point[0] or furthest_top == point[1] or furthest_bottom == point[1])]
    outline = list(set(outline))
    # outline = [outline_point for outline_point, value in outline.items() if value == 1]
    outline_points = outline
    hull = ConvexHull(np.array(outline_points))
    outline_points = [outline_points[vertex] for vertex in hull.vertices]
    outline_points = np.vstack((outline_points, outline_points[0]))  # Close the outline loop
    # while len(outline) > 0:
    #     outline_point = outline.pop(0)
    #     if outline_point is None:
    #         continue
        
    #     if iteration_count >= len(outline_points):
    #         outline_points.append(outline_point)
    #         iteration_count = 0
    #         continue

    #     if outline_point[0] == outline_points[-1][0] or outline_point[1] == outline_points[-1][1]:
    #         iteration_count = 0
    #         outline_points.append(outline_point)
    #     else:
    #         iteration_count += 1
    #         outline.append(outline_point)

    axis.plot(outline_points[:, 0], outline_points[:, 1], marker='', color='black', linestyle='-', label=f'Outline at Fold {fold_index}')

if __name__ == "__main__":
    fig, ax = plt.subplots(1,4, figsize=(25, 6))
    
    paper = Paper()
    fold1 = DiagonalFold(Point(2, 3), Point(1, 2), left_fold=False)
    print("Diagonal fold added:", fold1)
    fold2 = VerticalFold(0.5, left_fold=False)

    paper.add_fold(fold2)

    fold3 = HorizontalFold(1.5, downward=False)
    paper.add_fold(fold3)
    paper.add_fold(fold1)

    paper.punch(Point(2, 2))
    
    
    display_paper(paper.get_cells_at_fold(0), ax[0], show_punched=True)

    display_paper(paper.get_cells_at_fold(1), ax[1], show_punched=True)
    trace_outline(ax[1], 1, paper.cells.values())

    display_paper(paper.get_cells_at_fold(2), ax[2], show_punched=True)
    trace_outline(ax[2], 2, paper.cells.values())

    display_paper(paper.get_cells_at_fold(3), ax[3], show_punched=True)
    trace_outline(ax[3], 3, paper.cells.values())
    plt.show()
    print("Visualization complete.")