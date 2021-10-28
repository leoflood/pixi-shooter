import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { levelKey } from '../../game/interfaces';
import { startGame } from '../../game/start-game';
import AppContext from '../../utils/app-context';
import '../game/game.css';

export default function GameView() {
  const appContext = useContext(AppContext);
  const { levelKey } = useParams<{ levelKey: levelKey }>();

  useEffect(() => {
    startGame(levelKey, appContext.isTouch, () => {
      // When the game ends, it will redirect to levels menu
      window.location.replace('/levels-menu');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelKey]);

  return <div className="Game" />;
}
