import "./Home.css";

export default function Home() {
    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-12 text-center">
                    <h1>Welcome to Hole Punchler!</h1>
                    <pr className="lead fs-5">This site was created to help dental students study for the hole punch questions as part of the perceptual ability portion of the dental admissions test, or the DAT.</pr>
                    <pr className="fs-5"> The hole punch questions are a series of questions that ask you to visualize how a piece of paper would look after a series of folds and punches.</pr>
                    <pr className="fs-5"> This website consists of 2 different pages, a playground and a generator/game.  The generator or game, will randomly generate a question similar to what you'll see on the exam, and you have to deduce the correct answer.</pr>
                </div>
                <div className="col-5 text-center mt-5 page-container mx-auto" onClick={() => window.location.href="#playground"}>
                    <h2 className="mb-3">Playground</h2>
                    <p className="lead">The playground allows you to fold the paper and add punches to help you understand how each fold affects the answer.</p>
                    <img src="playground_thumbnail.png" alt="Playground Thumbnail" className="img-fluid rounded" style={{maxWidth: '100%', height: 'auto'}} />
                </div>
                <div className="col-5 text-center mt-5 page-container mx-auto" onClick={() => window.location.href="#game"}>
                    <h2 className="mb-3">Game</h2>
                    <p className="lead">The game will generate a random question and you have to deduce the correct answer.</p>
                    <p className="lead">This is a work in progress, so please be patient as I continue to add features.</p>
                    <img src="game_thumbnail.png" alt="Game Thumbnail" className="img-fluid rounded" style={{maxWidth: '100%', height: 'auto'}} />
                </div>
            </div>
        </div>
    )
}