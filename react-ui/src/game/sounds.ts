import { Howl } from 'howler';

interface ISounds {
  [key: string]: Howl;
}

const sounds: ISounds = {
  // Music
  'music-intro': new Howl({
    src: ['/snd/music-intro.mp3'],
    preload: true,
    loop: true,
  }),
  'music-intro-2': new Howl({
    src: ['/snd/music-intro-2.mp3'],
    preload: true,
    loop: true,
  }),
  'music-epic': new Howl({
    src: ['/snd/music-epic.mp3'],
    preload: true,
    volume: 1 / 3,
    loop: true,
  }),
  'music-dark': new Howl({
    src: ['/snd/music-dark.mp3'],
    preload: true,
    volume: 1 / 3,
    loop: true,
  }),

  // Effects
  ak47: new Howl({
    src: ['/snd/ak47.wav'],
    preload: true,
    volume: 0.2,
  }),
  shotgun: new Howl({
    src: ['/snd/shotgun.wav'],
    preload: true,
    volume: 0.2,
  }),
  pain: new Howl({
    src: ['/snd/pain.wav'],
    preload: true,
    volume: 0.2,
  }),
  heal: new Howl({
    src: ['/snd/heal.wav'],
    preload: true,
    volume: 0.2,
  }),
  'wall-hit': new Howl({
    src: ['/snd/wall-hit.wav'],
    preload: true,
    volume: 0.2,
  }),

  // Agents
  gorilla: new Howl({
    src: ['/snd/gorilla.wav'],
    preload: true,
    volume: 0.5,
  }),

  // Skills
  haha: new Howl({
    src: ['/snd/haha.wav'],
    preload: true,
  }),

  // Others
  clone: new Howl({
    src: ['/snd/clone.mp3'],
    preload: true,
  }),
};

export default sounds;

export type soundKey = keyof typeof sounds;
