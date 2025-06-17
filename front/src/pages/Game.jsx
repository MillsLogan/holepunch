import Paper from "../services/models/Paper";
import { useState } from "react";
import Fold from "../services/models/Fold";
import Point from "../services/models/Point";
import PaperRepresentation from "../components/PaperRepresentation";
import PunchButton from "../components/PunchControls/PunchButton";

const ALL_FOLDS = [
    Fold.VerticalFold(true, 1.5),
    Fold.VerticalFold(false, 1.5),
    Fold.VerticalFold(true, 0.5),
    Fold.VerticalFold(false, 0.5),
    Fold.VerticalFold(true, 2.5),
    Fold.VerticalFold(false, 2.5),

    Fold.HorizontalFold(true, 1.5),
    Fold.HorizontalFold(false, 1.5),
    Fold.HorizontalFold(true, 0.5),
    Fold.HorizontalFold(false, 0.5),
    Fold.HorizontalFold(true, 2.5),
    Fold.HorizontalFold(false, 2.5),

    Fold.DiagonalFold(true, new Point(1,0), new Point(0,1)),
    Fold.DiagonalFold(false, new Point(1,0), new Point(0,1)),
    Fold.DiagonalFold(true, new Point(2,0), new Point(0,2)),
    Fold.DiagonalFold(false, new Point(2,0), new Point(0,2)),
    Fold.DiagonalFold(true, new Point(3,0), new Point(0,3)),
    Fold.DiagonalFold(false, new Point(3,0), new Point(0,3)),
    Fold.DiagonalFold(true, new Point(1,3), new Point(3,1)),
    Fold.DiagonalFold(false, new Point(1,3), new Point(3,1)),
    Fold.DiagonalFold(true, new Point(2,3), new Point(3,2)),
    Fold.DiagonalFold(false, new Point(2,3), new Point(3,2)),

    Fold.DiagonalFold(true, new Point(2, 0), new Point(3, 1)),
    Fold.DiagonalFold(false, new Point(2, 0), new Point(3, 1)),
    Fold.DiagonalFold(true, new Point(1, 0), new Point(3, 2)),
    Fold.DiagonalFold(false, new Point(1, 0), new Point(3, 2)),
    Fold.DiagonalFold(true, new Point(0, 0), new Point(3, 3)),
    Fold.DiagonalFold(false, new Point(0, 0), new Point(3, 3)),
    Fold.DiagonalFold(true, new Point(2, 3), new Point(0, 1)),
    Fold.DiagonalFold(false, new Point(2, 3), new Point(0, 1)),
];


export default function Game() {
    const [paper, setPaper] = useState(new Paper());
    const [foldCount, setFoldCount] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    function generateNewQuestion() {
        setShowAnswer(false); // Reset the answer visibility
        clearPunches(); // Clear any active punch buttons
        const newPaper = new Paper();
        const numFolds = Math.floor(Math.random() * 2) + 2; // Random number of folds between 1 and 4
        setFoldCount(numFolds);
        for (let i = 0; i < numFolds; i++){
            newPaper.addFold(generateNextFold(newPaper));
        }

        while (true) {
            const punchPoint = new Point(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
            if (isPunchValid(punchPoint, newPaper)) {
                newPaper.punch(punchPoint);
                break; // Exit the loop once a valid punch point is found
            }
        }

        setPaper(newPaper);
    }

    // Generate a new question when the component mounts

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-12 text-center">
                    <h1>Game</h1>
                    <button className="btn btn-primary mb-3" onClick={generateNewQuestion}>
                        Generate New Question
                    </button>
                    <p className="lead fs-5">This is a work in progress, so please be patient as I continue to add features.</p>
                    <div className="row justify-content-center">
                        {foldCount > 0 && 
                            <div className="col mx-auto">
                                <PaperRepresentation paper={paper} canvasSize={200} foldIndex={0} displayPunches={showAnswer} /> 
                            </div> 
                        }
                        {foldCount >= 1 && 
                            <div className="col mx-auto">
                                <PaperRepresentation paper={paper} canvasSize={200} foldIndex={1} displayPunches={foldCount === 1 || showAnswer} /> 
                            </div> 
                        }
                        {foldCount >= 2 && 
                            <div className="col mx-auto">
                                <PaperRepresentation paper={paper} canvasSize={200} foldIndex={2} displayPunches={showAnswer} /> 
                            </div> 
                        }
                        {foldCount === 2 && 
                            <div className="col mx-auto">
                                <PaperRepresentation paper={paper} canvasSize={200} foldIndex={2} displayPunches={foldCount === 2} /> 
                            </div> 
                        }
                        {foldCount >= 3 && 
                            <div className="col mx-auto">
                                <PaperRepresentation paper={paper} canvasSize={200} foldIndex={3} displayPunches={showAnswer} /> 
                            </div> 
                        }
                        {foldCount === 3 && 
                            <div className="col mx-auto">
                                <PaperRepresentation paper={paper} canvasSize={200} foldIndex={3} displayPunches={foldCount === 3} /> 
                            </div>
                        }
                    </div>
                    <div className="row justify-content-center mt-3">
                        <button className="btn btn-secondary" onClick={() => setShowAnswer(!showAnswer)}>
                            {showAnswer ? "Hide Answer" : "Show Answer"}
                        </button>
                    </div>
                    <div className="row justify-content-center mt-5">
                        <div className="text-center" style={{ width: "fit-content" }}>
                            <PunchButton punchFunction={() => activatePunch("(0,0)")} disable={() => false} id="(0,0)"/>
                            <PunchButton punchFunction={() => activatePunch("(0,1)")} disable={() => false} id="(0,1)"/>
                            <PunchButton punchFunction={() => activatePunch("(0,2)")} disable={() => false} id="(0,2)"/>
                            <PunchButton punchFunction={() => activatePunch("(0,3)")} disable={() => false} id="(0,3)"/>
                        </div>
                        <div className="text-center" style={{ width: "fit-content" }}>
                            <PunchButton punchFunction={() => activatePunch("(1,0)")} disable={() => false} id="(1,0)"/>
                            <PunchButton punchFunction={() => activatePunch("(1,1)")} disable={() => false} id="(1,1)"/>
                            <PunchButton punchFunction={() => activatePunch("(1,2)")} disable={() => false} id="(1,2)"/>
                            <PunchButton punchFunction={() => activatePunch("(1,3)")} disable={() => false} id="(1,3)"/>
                        </div>
                        <div className="text-center" style={{ width: "fit-content" }}>
                            <PunchButton punchFunction={() => activatePunch("(2,0)")} disable={() => false} id="(2,0)"/>
                            <PunchButton punchFunction={() => activatePunch("(2,1)")} disable={() => false} id="(2,1)"/>
                            <PunchButton punchFunction={() => activatePunch("(2,2)")} disable={() => false} id="(2,2)"/>
                            <PunchButton punchFunction={() => activatePunch("(2,3)")} disable={() => false} id="(2,3)"/>
                        </div>
                        <div className="text-center" style={{ width: "fit-content" }}>
                            <PunchButton punchFunction={() => activatePunch("(3,0)")} disable={() => false} id="(3,0)"/>
                            <PunchButton punchFunction={() => activatePunch("(3,1)")} disable={() => false} id="(3,1)"/>
                            <PunchButton punchFunction={() => activatePunch("(3,2)")} disable={() => false} id="(3,2)"/>
                            <PunchButton punchFunction={() => activatePunch("(3,3)")} disable={() => false} id="(3,3)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function clearPunches() {
    const punchButtons = document.querySelectorAll(".punch-button-container");
    punchButtons.forEach(button => {
        button.classList.remove("active");
    });
}

function activatePunch(point) {
    const punchButton = document.getElementById(point);
    if (punchButton) {
        if (punchButton.classList.contains("active")) {
            punchButton.classList.remove("active"); // If the button is already active, do nothing
        } else {
            punchButton.classList.add("active");
        }
    }
}

function generateNextFold(paper) {
    const possibleFolds = ALL_FOLDS.filter(fold => paper.checkFoldIsValid(fold));
    if (possibleFolds.length === 0) {
        return null; // No valid folds left
    }
    const randomIndex = Math.floor(Math.random() * possibleFolds.length);
    return possibleFolds[randomIndex];
}

function isPunchValid(point, paper) {
        const cellsAtPoint = paper.cells.filter(cell => cell.getLastRepresentation().center.x === point.x && cell.getLastRepresentation().center.y === point.y);
        if (cellsAtPoint.length > 0) {
            return true;
        } else {
            return false; // If no cells at the point, disable the button
        }
    }