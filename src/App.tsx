import './App.css'
import Layout from "./components/Layout/Layout.tsx";
import GameContainer from "./components/Layout/GameContainer.tsx";
import GameView from "./views/GameView.tsx";
import {BetSlips} from "./views/BetSlips.tsx";

function App() {
  return (
    <Layout>
      <GameContainer>
        <GameView/>
        <BetSlips/>
      </GameContainer>
    </Layout>
  )
}

export default App
