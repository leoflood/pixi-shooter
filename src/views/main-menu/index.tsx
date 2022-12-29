import { Link } from "react-router-dom";
import CreatedBy from "../../components/created-by";
import "../main-menu/main-menu.css";

export default function MainMenuView() {
  return (
    <div className="dialog space-around">
      <h1 className="title">Pixi Shooter</h1>

      <Link className="play-button" to="/levels-menu">
        Play
      </Link>

      <CreatedBy />
    </div>
  );
}
