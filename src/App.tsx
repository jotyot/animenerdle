import Grid from "./Components/Grid";
import puzzle from "./PuzzleMaker/puzzle.json";

function App() {
  return <Grid puzzleTemplate={puzzle} />;
}

export default App;
