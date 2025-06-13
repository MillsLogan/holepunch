import Paper from './services/models/Paper';
import { useRef, useEffect, useState } from 'react';
import Point from './services/models/Point';

export default function PaperRepresentation({paper, foldIndex, canvasSize=500}) {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.canvas.width = canvasSize; // Set canvas width
        context.canvas.height = canvasSize; // Set canvas height

        context.fillStyle = 'black'; // Background color
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        for (let zIndex = 0; zIndex < Math.pow(2, paper.folds.length); zIndex++) {
            drawLayer(zIndex, context, paper.getCellsAtFold(foldIndex));
        }
    });

    function drawCell(cellRepresentation, canvasContext, isPunched=false) {
        const { point, orientation, isHalved } = cellRepresentation;
        const size = Math.floor(canvasSize / 4); // Size of the cell
        canvasContext.save();
        
        canvasContext.fillStyle = 'white';
        canvasContext.scale(size, size);
        canvasContext.translate(0.5,0.5);
        const path = new Path2D();
        const topLeft = cellRepresentation.topLeft;
        path.moveTo(topLeft.x, topLeft.y);
        const bottomLeft = cellRepresentation.bottomLeft;
        path.lineTo(bottomLeft.x, bottomLeft.y);
        const bottomRight = cellRepresentation.bottomRight;
        path.lineTo(bottomRight.x, bottomRight.y);
        const topRight = cellRepresentation.topRight;
        path.lineTo(topRight.x, topRight.y);
        
        path.closePath();
        canvasContext.fill(path);

        if (isPunched) {
            canvasContext.fillStyle = 'black';
            const punchPath = new Path2D();
            punchPath.arc(point.x, point.y, 0.25, 0, Math.PI * 2);
            punchPath.closePath();
            canvasContext.fill(punchPath);
        }

        
        
        canvasContext.restore();
    }

    function drawLayer(zIndex, canvasContext, cellRepresentations) {
        let outline = [];
        let maxX = 0;
        let maxY = 0;
        let minX = Infinity;
        let minY = Infinity;
        for (const cells of Object.values(cellRepresentations)) {
            for (const [isPunched, cellRepresentation] of cells) {
                if (cellRepresentation.zIndex === zIndex) {
                    drawCell(cellRepresentation, canvasContext, isPunched);
                    const topLeft = cellRepresentation.topLeft;
                    const topRight = cellRepresentation.topRight;
                    const bottomRight = cellRepresentation.bottomRight;
                    const bottomLeft = cellRepresentation.bottomLeft;
                    outline.push(topLeft);
                    outline.push(bottomRight);
                    outline.push(bottomLeft);
                    outline.push(topRight);
                    maxX = Math.max(maxX, bottomRight.x);
                    maxY = Math.max(maxY, bottomRight.y);

                    maxX = Math.max(maxX, topRight.x);
                    maxY = Math.max(maxY, bottomLeft.y);
                    
                    minY = Math.min(minY, topRight.y);
                    minX = Math.min(minX, bottomLeft.x);

                    minX = Math.min(minX, topLeft.x);
                    minY = Math.min(minY, topLeft.y);
                }
            }
        }

        

        outline = outline.filter((point, index) => {
            return point.x === minX || point.x === maxX || point.y === minY || point.y === maxY;
        });
        console.log('Outline before sorting:', outline);
        const size = 125;
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
        canvasContext.restore();
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

