import './App.css'
import Layout from "./components/Layout/Layout.tsx";
import GameContainer from "./components/Layout/GameContainer.tsx";
import GameView from "./views/GameView.tsx";

function App() {
  return (
    <Layout>
      <GameContainer>
        <GameView />
      </GameContainer>
    </Layout>
  )
}

export default App
