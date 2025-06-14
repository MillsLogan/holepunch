import "./PunchButton.css";

export default function PunchButton({ punchFunction, disable, ...props }) {
    return (
        <div className="col-3 punch-button-container d-flex justify-content-center align-items-center" {...props}>
            <button className="punch-button" onClick={() => punchFunction()} disabled={disable()} ></button>
        </div>
    )
}