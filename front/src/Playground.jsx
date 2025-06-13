import PaperRepresentation from "./PaperRepresentation";
import Paper from "./services/models/Paper";
import { useState, useCallback } from "react";
import FoldControls from "./components/FoldControls/FoldControls.jsx";
import PunchControls from "./components/PunchControls/PunchControls.jsx";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import './Playground.css';
import FoldButtonEnum from "./components/FoldControls/FoldButtonEnum.js";
import FoldHistoryCell from "./components/FoldHistoryCell.jsx";


export default function Playground() {
    const [paper, setPaper] = useState(new Paper());
    const [foldCount, setFoldCount] = useState(0);
    const [currentFold, setCurrentFold] = useState(foldCount);
    const [punched, setPunched] = useState(false);
    const [punchCount, setPunchCount] = useState(0); // Used to update the model
    const maxFolds = 4;

    function punchButtonDisableMap(point) {
        const cellsAtPoint = paper.cells.filter(cell => cell.getLastRepresentation().point.x === point.x && cell.getLastRepresentation().point.y === point.y);
        if (cellsAtPoint.length > 0) {
            return cellsAtPoint.some(cell => cell.getLastRepresentation().punched);
        } else {
            return true; // If no cells at the point, disable the button
        }
    }

    function isFoldValid(fold) {
        return (!paper.checkFoldIsValid(fold)) || foldCount === maxFolds;
    }

    function updateAfterFold(fold) {
        paper.addFold(fold);
        setPaper(paper);
        setFoldCount(foldCount + 1);
        setCurrentFold(foldCount + 1);
    }

    function punch(point){
        paper.punch(point);
        setPunched(true);
        setPaper(paper);
        setPunchCount(punchCount + 1); // Increment punch count to update the model
    }

    function reset() {
        setPaper(new Paper());
        setFoldCount(0);
        setCurrentFold(0);
        setPunched(false);
    }


    function getPaper() {
    return (
        <>
        <div className="container text-center">
            <h1>Hole Punch Playground!</h1>
            <p>Use this page to explore different representations and see how a fold or punch would appear.</p>
            <div className="row justify-content-center">
                <div className="col-3 align-self-top mt-5">
                    <FoldControls
                        onFold={updateAfterFold}
                        isFoldDisabled={isFoldValid}
                    />
                </div>
                <div className="col-5">
                    <h2>Current Paper</h2>
                    <PaperRepresentation paper={paper} foldIndex={currentFold} />
                    <div className="row justify-content-center mx-5">
                        <button className="prev-fold-btn col-5 mx-2" onClick={() => {
                            if (currentFold > 0) {
                                setCurrentFold(currentFold - 1);
                            }
                        }
                        }disabled={currentFold === 0}><ArrowBigLeft size={40}/></button>
                        <button className="next-fold-btn col-5 mx-2" onClick={() => {
                            if (currentFold < foldCount) {
                                setCurrentFold(currentFold + 1);
                            }
                        }
                        } disabled={currentFold === foldCount}><ArrowBigRight size={40}/></button>
                        <button className="reset-btn col-10 mt-2" onClick={reset}>Reset</button>
                        <div className="row justify-content-center mt-5 mb-5">
                            <FoldHistoryCell paper={paper} foldIndex={1}/>
                            <FoldHistoryCell paper={paper} foldIndex={2}/>
                            <FoldHistoryCell paper={paper} foldIndex={3}/>
                        </div>
                    </div>
                </div>
                <div className="col-4 align-items-center align-self-top">
                    <PunchControls
                        punchFunction={punch}
                        disabledMap={punchButtonDisableMap}
                    />
                </div>
            </div>
            
        </div>
        </>
        );
    }

    return (
    <>
        { getPaper() }
    </>
    )
}
