import { Howl } from "howler";
import { getUrl } from "../utils/utils";

interface ISounds {
  [key: string]: Howl;
}

const sounds: ISounds = {
  // Music
  "music-intro": new Howl({
    src: [getUrl("/snd/music-intro.mp3")],
    preload: true,
    loop: true,
  }),
  "music-intro-2": new Howl({
    src: [getUrl("/snd/music-intro-2.mp3")],
    preload: true,
    loop: true,
  }),
  "music-epic": new Howl({
    src: [getUrl("/snd/music-epic.mp3")],
    preload: true,
    volume: 1 / 3,
    loop: true,
  }),
  "music-dark": new Howl({
    src: [getUrl("/snd/music-dark.mp3")],
    preload: true,
    volume: 1 / 3,
    loop: true,
  }),

  // Effects
  ak47: new Howl({
    src: [getUrl("/snd/ak47.wav")],
    preload: true,
    volume: 0.2,
  }),
  shotgun: new Howl({
    src: [getUrl("/snd/shotgun.wav")],
    preload: true,
    volume: 0.2,
  }),
  pain: new Howl({
    src: [getUrl("/snd/pain.wav")],
    preload: true,
    volume: 0.2,
  }),
  heal: new Howl({
    src: [getUrl("/snd/heal.wav")],
    preload: true,
    volume: 0.2,
  }),
  "wall-hit": new Howl({
    src: [getUrl("/snd/wall-hit.wav")],
    preload: true,
    volume: 0.2,
  }),

  // Agents
  gorilla: new Howl({
    src: [getUrl("/snd/gorilla.wav")],
    preload: true,
    volume: 0.5,
  }),

  // Skills
  haha: new Howl({
    src: [getUrl("/snd/haha.wav")],
    preload: true,
  }),

  // Others
  clone: new Howl({
    src: [getUrl("/snd/clone.mp3")],
    preload: true,
  }),
};

export default sounds;

export type soundKey = keyof typeof sounds;
