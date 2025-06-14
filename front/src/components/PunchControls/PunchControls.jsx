import Point from "../../services/models/Point";
import PunchButton from "./PunchButton";

export default function PunchControls({ punchFunction, disabledMap }) {

    return (
        <div className="punch-options row justify-content-center mt-5">
            <h2>Punch</h2>
            <hr></hr>
            <div className="row justify-content-between">
                <PunchButton punchFunction={() => punchFunction(new Point(0, 0))} disable={() => disabledMap(new Point(0,0))} />
                <PunchButton punchFunction={() => punchFunction(new Point(1, 0))} disable={() => disabledMap(new Point(1,0))} />
                <PunchButton punchFunction={() => punchFunction(new Point(2, 0))} disable={() => disabledMap(new Point(2,0))} />
                <PunchButton punchFunction={() => punchFunction(new Point(3, 0))} disable={() => disabledMap(new Point(3,0))} />
            </div>
            <div className="row justify-content-between">
                <PunchButton punchFunction={() => punchFunction(new Point(0, 1))} disable={() => disabledMap(new Point(0,1))} />
                <PunchButton punchFunction={() => punchFunction(new Point(1, 1))} disable={() => disabledMap(new Point(1,1))} />
                <PunchButton punchFunction={() => punchFunction(new Point(2, 1))} disable={() => disabledMap(new Point(2,1))} />
                <PunchButton punchFunction={() => punchFunction(new Point(3, 1))} disable={() => disabledMap(new Point(3,1))} />
            </div>
            <div className="row justify-content-between">
                <PunchButton punchFunction={() => punchFunction(new Point(0, 2))} disable={() => disabledMap(new Point(0,2))} />
                <PunchButton punchFunction={() => punchFunction(new Point(1, 2))} disable={() => disabledMap(new Point(1,2))} />
                <PunchButton punchFunction={() => punchFunction(new Point(2, 2))} disable={() => disabledMap(new Point(2,2))} />
                <PunchButton punchFunction={() => punchFunction(new Point(3, 2))} disable={() => disabledMap(new Point(3,2))} />
            </div>
            <div className="row justify-content-between">
                <PunchButton punchFunction={() => punchFunction(new Point(0, 3))} disable={() => disabledMap(new Point(0,3))} />
                <PunchButton punchFunction={() => punchFunction(new Point(1, 3))} disable={() => disabledMap(new Point(1,3))} />
                <PunchButton punchFunction={() => punchFunction(new Point(2, 3))} disable={() => disabledMap(new Point(2,3))} />
                <PunchButton punchFunction={() => punchFunction(new Point(3, 3))} disable={() => disabledMap(new Point(3,3))} />
            </div>
        </div>
    )
}