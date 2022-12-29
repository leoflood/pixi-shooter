import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import BackButton from "../../components/back-button";
import sounds from "../../game/sounds";
import "./style.css";

export default function IndexView() {
  const [showLoading, setShowLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const music = sounds["music-intro-2"];
    let timeout = setTimeout(() => null);

    music.on("load", () => {
      setShowLoading(false);
      music.play();
      timeout = setTimeout(() => {
        navigate("/main-menu");
      }, 20000);
    });

    return () => {
      music.stop();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showLoading) {
    return <h2 style={{ color: "#feda4a" }}>Loading...</h2>;
  }

  return (
    <div className="intro-text-container">
      <div className="back-button-container">
        <BackButton
          className="back-button"
          onClick={() => navigate("/main-menu")}
        />
      </div>
      <div className="fade" />

      <section className="star-wars">
        <div className="crawl">
          <div className="title">
            <h1>Pixi Shooter</h1>
          </div>

          <p>
            This is a 2D demo shooter developed with Typescript, Pixi JS and
            React that uses the composite design pattern. You will try to
            survive from the enemies that will appear and use your skills
            against them.
          </p>
        </div>
      </section>
    </div>
  );
}
