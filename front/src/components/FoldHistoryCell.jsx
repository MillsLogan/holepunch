import PaperRepresentation from "../PaperRepresentation";
import { useState } from "react";

export default function FoldHistoryCell({ paper, foldIndex, isActive, canvasSize=100}) {

    function getElement() {
        return (
            paper.folds.length >= foldIndex && <PaperRepresentation paper={paper} foldIndex={foldIndex} canvasSize={canvasSize} />
        )
    }

    return (
    <div className="" style={{width: "fit-content"}}>
        <h3>Fold {foldIndex + 1}</h3>   
        
        {getElement()}
    </div>
    );
}