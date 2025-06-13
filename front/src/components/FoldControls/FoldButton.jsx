import { ArrowBigLeft } from 'lucide-react';
import { ArrowBigRight } from 'lucide-react';
import "./FoldButton.css";
import { useState } from 'react';

export default function FoldButton({ leftFold, rightFold, onFold, disabled, props }) {
    const [leftFoldObject, setLeftFoldObject] = useState(leftFold);
    const [rightFoldObject, setRightFoldObject] = useState(rightFold);

    return (
        <div className="fold-button-container d-flex" { ...props }>
            <button className="fold-button fold-button-left" onClick={() => onFold(leftFoldObject)} disabled={disabled(leftFoldObject)}>
                <ArrowBigLeft size={35} />
            </button>
            <button className="fold-button fold-button-right" onClick={() => onFold(rightFoldObject)} disabled={disabled(rightFoldObject)}>
                <ArrowBigRight size={35} className="my-auto" />
            </button>
        </div>
    )
}