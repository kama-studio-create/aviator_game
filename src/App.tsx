import './App.css'
import Layout from "./components/Layout/Layout.tsx";
import GameContainer from "./components/Layout/GameContainer.tsx";
import {NewGameView} from "./views/NewGameView.tsx";

function App() {

  return (
    <Layout>
      <GameContainer>
        {/*<GameView />*/}
        <NewGameView />
      </GameContainer>
    </Layout>
  )
}

export default App
