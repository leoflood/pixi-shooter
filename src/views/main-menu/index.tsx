import { Link } from "react-router-dom";
import "../main-menu/main-menu.css";

export default function MainMenuView() {
  return (
    <div className="dialog space-around">
      <h1 className="title">Game Title</h1>

      <Link className="play-button" to="/pixi-shooter/levels-menu">
        Play
      </Link>
    </div>
  );
}
