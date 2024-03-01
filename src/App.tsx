import './App.css'
import Layout from "./components/Layout/Layout.tsx";
import GameContainer from "./components/Layout/GameContainer.tsx";
import {NewGameView} from "./views/NewGameView.tsx";
import {UserInputView} from "./views/UserInputView.tsx";
import {useState} from "react";

function App() {
  const [userMultiplier, setUserMultiplier] = useState(1);
  return (
    <Layout>
      <GameContainer>
        {/*<GameView />*/}
        <NewGameView />
        <UserInputView />
      </GameContainer>
    </Layout>
  )
}

export default App
