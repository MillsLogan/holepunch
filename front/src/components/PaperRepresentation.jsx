import Paper from '../services/models/Paper';
import { useRef, useEffect, useState } from 'react';
import Point from '../services/models/Point';

export default function PaperRepresentation({paper, foldIndex, canvasSize=500, displayPunches=true}) {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.canvas.width = canvasSize; // Set canvas width
        context.canvas.height = canvasSize; // Set canvas height

        context.fillStyle = 'black'; // Background color
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        const maxZIndex = Math.max(...paper.cells.map(cell => cell.getRepresentationAt(foldIndex).zIndex));
        let punches = [];
        for (let zIndex = 0; zIndex < Math.pow(2, paper.folds.length); zIndex++) {
            punches = drawLayer(zIndex, context, paper.getCellsAtFold(foldIndex), true, punches);
        }

        for (const cellRepresentation of punches) {
            drawPunch(cellRepresentation, context);
        }
    });

    function drawPunch(cellRepresentation, canvasContext) {
        const { center } = cellRepresentation;
        const size = Math.floor(canvasSize / 4); // Size of the cell
        canvasContext.save();
        canvasContext.fillStyle = 'white';
        canvasContext.scale(size, size);
        canvasContext.translate(0.5,0.5);
        canvasContext.fillStyle = 'black';
        const punchPath = new Path2D();
        punchPath.arc(center.x, center.y, 0.25, 0, Math.PI * 2);
        punchPath.closePath();
        canvasContext.fill(punchPath);

        canvasContext.restore();
    }

    function drawLayer(zIndex, canvasContext, cellRepresentations, drawOutline=true, punches=[]) {
        let outline = [];
        let maxX = -Infinity;
        let maxY = -Infinity;
        let minX = Infinity;
        let minY = Infinity;
        for (const cells of Object.values(cellRepresentations)) {
            for (const [isPunched, cellRepresentation] of cells) {
                if (isPunched && displayPunches) {
                    punches.push(cellRepresentation);
                }
                const { center, topLeft, topRight, bottomLeft, bottomRight } = cellRepresentation;
                if (topLeft.zArray.some((z) => z === zIndex)) {
                    outline.push(topLeft);
                    maxX = Math.max(maxX, topLeft.x);
                    maxY = Math.max(maxY, topLeft.y);
                    minX = Math.min(minX, topLeft.x);
                    minY = Math.min(minY, topLeft.y);
                }
                if (topRight.zArray.some((z) => z === zIndex)) {
                    outline.push(topRight);
                    maxX = Math.max(maxX, topRight.x);
                    maxY = Math.max(maxY, topRight.y);
                    minX = Math.min(minX, topRight.x);
                    minY = Math.min(minY, topRight.y);
                }
                if (bottomLeft.zArray.some((z) => z === zIndex)) {
                    outline.push(bottomLeft);
                    maxX = Math.max(maxX, bottomLeft.x);
                    maxY = Math.max(maxY, bottomLeft.y);
                    minX = Math.min(minX, bottomLeft.x);
                    minY = Math.min(minY, bottomLeft.y);
                }
                if (bottomRight.zArray.some((z) => z === zIndex)) {
                    outline.push(bottomRight);
                    maxX = Math.max(maxX, bottomRight.x);
                    maxY = Math.max(maxY, bottomRight.y);
                    minX = Math.min(minX, bottomRight.x);
                    minY = Math.min(minY, bottomRight.y);
                }
                if (center.zArray.some((z) => z === zIndex)) {
                    outline.push(center);
                    maxX = Math.max(maxX, center.x);
                    maxY = Math.max(maxY, center.y);
                    minX = Math.min(minX, center.x);
                    minY = Math.min(minY, center.y);
                }
            }
        }
        
        if (!drawOutline || outline.length === 0) {
            return punches;;
        }
        outline = outline.filter((point, index) => {
            return point.x === minX || point.x === maxX || point.y === minY || point.y === maxY;
        });
        const size = canvasSize / 4;
        outline = sortPointsClockwise(outline);
        canvasContext.save();
        canvasContext.scale(size, size);
        canvasContext.translate(0.5,0.5);
        const path = new Path2D();
        outline.forEach((point, index) => {
            if (index === 0) {
                path.moveTo(point.x, point.y);
            } else {
                path.lineTo(point.x, point.y);
            }
        });
        path.closePath();
        canvasContext.strokeStyle = 'black'; 
        canvasContext.lineWidth = 0.03;
        canvasContext.stroke(path);
        canvasContext.fillStyle = 'white';
        canvasContext.fill(path);
        console.log(outline);
        canvasContext.restore();
        return punches;
    }

    return (
        <canvas ref={canvasRef} />        
    );
}

function sortPointsClockwise(points) {
    const center = points.reduce((acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
    }, new Point(0, 0));
    center.x /= points.length;
    center.y /= points.length;
    const angles = points.map(point => {
        const angle = Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI; // Convert to degrees
        return { point, angle };
    })
    return angles.sort((a, b) => {
        return a.angle - b.angle;
    }).map(angle => {
        return angle.point;
    });
}

