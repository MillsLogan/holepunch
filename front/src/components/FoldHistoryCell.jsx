import PaperRepresentation from "./PaperRepresentation";
import { useState } from "react";

export default function FoldHistoryCell({ paper, foldIndex, isActive, canvasSize=100, showPunches=false }) {

    function getElement() {
        return (
            paper.folds.length >= foldIndex && <PaperRepresentation paper={paper} foldIndex={foldIndex} canvasSize={canvasSize} displayPunches={showPunches} />
        )
    }

    return (
    <div className="col-3" style={{width: "fit-content"}}>
        <h3>Fold {foldIndex}</h3>   
        
        {getElement()}
    </div>
    );
}