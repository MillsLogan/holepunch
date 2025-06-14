import { useEffect } from "react"

export default function Navbar({activePage="home"}) {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
            <a className="navbar-brand" href="#">Hole Punchler</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <a className={`nav-link ${activePage === "home" ? "active" : ""}`} aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                <a className={`nav-link ${activePage==="playground" ? "active" : ""}`} href="#playground">Playground</a>
                </li>
                <li className="nav-item">
                <a className={`nav-link ${activePage==="game" ? "active" : ""}`} href="#game">Game</a>
                </li>
            </ul>
            <div className="d-flex">
                <a className="btn btn-outline-success" href="https://millslogan.github.io" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-person"></i> About the Developer
                </a>
            </div>
            </div>
        </div>
    </nav>
    )
}