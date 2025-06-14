import Fold from "../../services/models/Fold";
import Point from "../../services/models/Point";
import FoldButton from "./FoldButton";
import FoldButtonEnum from "./FoldButtonEnum";

export default function FoldControls({ onFold, isFoldDisabled }) {

    return (
        <>
            <h2>Fold Options</h2>
            <hr />
            <div className="fold-controls d-flex flex-row mt-5">
                {/* First column: Left diagonal folds */}
                <div className="left-diagonal-fold-options row mx-auto gy-5">
                    <div>
                        <FoldButton
                            leftFold={Fold.DiagonalFold(true, new Point(1, 0), new Point(0, 1))}
                            rightFold={Fold.DiagonalFold(false, new Point(1, 0), new Point(0, 1))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{ style: { transform: "rotate(45deg)" } }}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.DiagonalFold(true, new Point(2, 0), new Point(0, 2))}
                            rightFold={Fold.DiagonalFold(false, new Point(2, 0), new Point(0, 2))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{ style: { transform: "rotate(45deg)" } }}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.DiagonalFold(true, new Point(3, 0), new Point(0, 3))}
                            rightFold={Fold.DiagonalFold(false, new Point(3, 0), new Point(0, 3))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{ style: { transform: "rotate(45deg)" } }}                            
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.DiagonalFold(true, new Point(1, 3), new Point(3, 1))}
                            rightFold={Fold.DiagonalFold(false, new Point(1, 3), new Point(3, 1))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{ style: { transform: "rotate(45deg)" } }}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.DiagonalFold(true, new Point(2, 3), new Point(3, 2))}
                            rightFold={Fold.DiagonalFold(false, new Point(2, 3), new Point(3, 2))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{ style: { transform: "rotate(45deg)" } }}                            
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.VerticalFold(true, 0.5)}
                            rightFold={Fold.VerticalFold(false, 0.5)}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                        />
                    </div>
                </div>
                {/* Second column: Horizontal folds */}
                <div className="horizontal-fold-options d-flex flex-column mx-auto justify-content-between">
                    <div className="">
                        <FoldButton
                            leftFold={Fold.HorizontalFold(true, 0.5)}
                            rightFold={Fold.HorizontalFold(false, 0.5)}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={ { style: { transform: "rotate(90deg)" }}}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.HorizontalFold(true, 1.5)}
                            rightFold={Fold.HorizontalFold(false, 1.5)}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={ { style: { transform: "rotate(90deg)" }}}

                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.HorizontalFold(true, 2.5)}
                            rightFold={Fold.HorizontalFold(false, 2.5)}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={ { style: { transform: "rotate(90deg)" }}}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.VerticalFold(true, 1.5)}
                            rightFold={Fold.VerticalFold(false, 1.5)}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                        />
                    </div>
                </div>
                {/* Third column: Right diagonal folds */}
                <div className="right-diagonal-fold-options justify-content-between row gy-5 mx-auto">
                    <div>
                        <FoldButton
                            leftFold = {Fold.DiagonalFold(true, new Point(2, 0), new Point(3, 1))}
                            rightFold = {Fold.DiagonalFold(false, new Point(2, 0), new Point(3, 1))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{ style: { transform: "rotate(-45deg)" } }}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold = {Fold.DiagonalFold(true, new Point(1, 0), new Point(3, 2))}
                            rightFold = {Fold.DiagonalFold(false, new Point(1, 0), new Point(3, 2))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{style : { transform: "rotate(-45deg)" } }}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold = {Fold.DiagonalFold(true, new Point(0, 0), new Point(3, 3))}
                            rightFold = {Fold.DiagonalFold(false, new Point(0, 0), new Point(3, 3))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{ style: { transform: "rotate(-45deg)" } }}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold = {Fold.DiagonalFold(true, new Point(2, 3), new Point(0, 1))}
                            rightFold = {Fold.DiagonalFold(false, new Point(2, 3), new Point(0, 1))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{style : { transform: "rotate(-45deg)" } }}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold = {Fold.DiagonalFold(true, new Point(1,3), new Point(0, 2))}
                            rightFold = {Fold.DiagonalFold(false, new Point(1, 3), new Point(0, 2))}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                            props={{ style: { transform: "rotate(-45deg)" } }}
                        />
                    </div>
                    <div>
                        <FoldButton
                            leftFold={Fold.VerticalFold(true, 2.5)}
                            rightFold={Fold.VerticalFold(false, 2.5)}
                            onFold={onFold}
                            disabled={isFoldDisabled}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}