import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import getSizeByAspectRatio from './utils/get-size-by-aspect-ratio';
import useWindowSize from './utils/use-window-size';
import './App.css';
import MainMenuView from './views/main-menu';
import LevelsMenuView from './views/levels-menu';
import GameView from './views/game';
import IndexView from './views/index';

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
      <Router>
        <Switch>
          <Route exact path="/">
            <IndexView />
          </Route>

          <Route exact path="/main-menu">
            <MainMenuView />
          </Route>

          <Route exact path="/levels-menu">
            <LevelsMenuView />
          </Route>

          <Route exact path="/game/:levelKey">
            <GameView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
