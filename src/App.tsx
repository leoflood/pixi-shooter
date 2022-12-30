import { HashRouter as Router, Routes, Route } from "react-router-dom";
import getSizeByAspectRatio from "./utils/get-size-by-aspect-ratio";
import useWindowSize from "./utils/use-window-size";
import "./App.css";
import MainMenuView from "./views/main-menu";
import LevelsMenuView from "./views/levels-menu";
import GameView from "./views/game";
import IndexView from "./views/index";
import Favicon from "react-favicon";
import { getUrl } from "./utils/utils";

// Aspect ratio off the app
const ASPECT_RATIO = 16 / 9;

export default function App() {
  const { width, height } = useWindowSize();
  const appSize = getSizeByAspectRatio(width!, height!, ASPECT_RATIO);

  return (
    <div
      className="App"
      style={{ width: appSize.width, height: appSize.height }}
    >
      <Favicon url={getUrl("/img/char1.png")} />

      <Router>
        <Routes>
          <Route path="/" element={<IndexView />} />
          <Route path="/main-menu" element={<MainMenuView />} />
          <Route path="/levels-menu" element={<LevelsMenuView />} />
          <Route path="/game/:levelKey" element={<GameView />} />
        </Routes>
      </Router>
    </div>
  );
}
