import './App.css'
import Layout from "./components/Layout/Layout.tsx";
import GameContainer from "./components/Layout/GameContainer.tsx";
import {NewGameView} from "./views/NewGameView.tsx";
import {UserInputView} from "./views/UserInputView.tsx";

function App() {
  return (
    <Layout>
      <GameContainer>
        <NewGameView />
        <UserInputView />
      </GameContainer>
    </Layout>
  )
}

export default App
