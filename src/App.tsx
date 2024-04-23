import './App.css'
import Layout from "./apps/aviator/components/Layout/Layout.tsx";
import GameContainer from "./apps/aviator/components/Layout/GameContainer.tsx";
import GameView from "./apps/aviator/views/GameView.tsx";

function App() {
  return (
    <Layout>
      <GameContainer>
        <GameView/>
      </GameContainer>
    </Layout>
  )
}

export default App
