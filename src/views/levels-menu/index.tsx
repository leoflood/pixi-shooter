import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import AppContext from "../../utils/app-context";
import "../levels-menu/levels-menu.css";
import levels from "../../game/levels.json";
import { levelKey } from "../../game/interfaces";
import { getUserData } from "../../utils/local-storage";
import BackButton from "../../components/back-button";

const levelsKeys = Object.keys(levels);
export default function LevelsMenuView() {
  const { isTouch } = useContext(AppContext);
  const navigate = useNavigate();
  const [userData] = useState(getUserData());

  return (
    <>
      <div className="dialog">
        <div className="back-button-container">
          <BackButton
            className="back-button"
            onClick={() => navigate("/main-menu")}
          />
        </div>

        <div>
          <p className="levels-title">
            Game instructions (Swipe down to see the levels)
          </p>

          <ul>
            <b>Controls</b>
            <li>
              Movement: <b>{isTouch ? "Left joystick" : "W-A-S-D"}</b>
            </li>
            <li>
              Shoot: <b>{isTouch ? "Right joystick" : "Mouse + Click"}</b>
            </li>
          </ul>

          <ul className="skills">
            <b>Skills</b>
            <li>
              <b>Q</b> Skill 1 description.
            </li>
            <li>
              <b>E</b> Skill 2 description.
            </li>
            <li>
              <b>R</b> Skill 3 description.
            </li>
            <li>
              <b>T</b> Skill 4 description.
            </li>
          </ul>
        </div>

        <div className="levels-list-container">
          {levelsKeys.map((k) => {
            const lk = k as levelKey;
            const levelData = levels[lk];

            const disabled = !(
              levelData.levelOrder <=
              userData.lastLevelFinished + 1
            );

            const completed =
              levelData.levelOrder <= userData.lastLevelFinished;

            return (
              <button
                disabled={disabled}
                className="level"
                key={lk}
                onClick={() => navigate(`/game/${lk}`)}
              >
                <div className="level-text-container">
                  <div className="level-title-container">
                    <b>{levelData.title}</b>
                    {completed ? <b>Completed</b> : null}
                  </div>

                  <br />

                  <span className="level-description">
                    {levelData.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
