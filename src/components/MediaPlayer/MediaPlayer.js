import { ProgressBarComponent } from "./ProgressBar/ProgressBar";
import { AudioInfoComponent } from "./AudioInfo/AudioInfo";
import { RatingComponent } from "./Rating/Rating";
import { MainControlComponent } from "./MainControl/MainControl";
import { DotsMenuComponent } from "../DotsMenu/DotsMenu";

import playerTemplate from "./MediaPlayer.html";

const SONG_INFO = {
  songSrc:
    "http://drivemusic.me/dl/ar8_BdKPhBpvPyoPFMdryQ/1540528751/download_music/2013/06/jazzamor-way-back.mp3",
  songImageSrc:
    "https://s-media-cache-ak0.pinimg.com/originals/0e/f8/fd/0ef8fd42bb061ede2c2b6d1a9689782b.jpg",
  songName: "Way Back",
  album: "Lazy Sunday",
  artistName: "Jazzamor"
};

export class MediaPlayerComponent {
  constructor(mountPoint) {
    this.mountPoint = mountPoint;
  }

  querySelectors() {
    this.audio = this.mountPoint.querySelector(".media-player__main-audio");
    this.buttons = this.mountPoint.querySelector(".media-player__buttons");
    this.progressBar = this.mountPoint.querySelector(
      ".media-player__progress-bar"
    );
    this.mainControl = this.mountPoint.querySelector(
      ".media-player__main-control"
    );
    this.volumeBar = this.mountPoint.querySelector(".media-player__volume-bar");
    this.audioInfo = this.mountPoint.querySelector(".media-player__audio-info");
    this.audioRating = this.mountPoint.querySelector(
      ".media-player__audio-rating"
    );
    this.dotsMenuPoint = this.mountPoint.querySelector(
      ".media-player__dots-menu"
    );
  }

  set audioTime(val) {
    this.audio.currentTime = val;
  }

  mountChildren() {
    this.mainControlPannel = new MainControlComponent(this.mainControl, {
      song: SONG_INFO.songSrc,
      audio: this.audio
    });
    this.mainControlPannel.mount();
    this.audioProgressBar = new ProgressBarComponent(this.progressBar, {
      audio: this.audio
    });
    this.audioProgressBar.mount();
    this.audioInfoComponent = new AudioInfoComponent(this.audioInfo, {
      image: SONG_INFO.songImageSrc,
      songName: SONG_INFO.songName,
      album: SONG_INFO.album,
      artistName: SONG_INFO.artistName
    });
    this.audioInfoComponent.mount();
    this.audioRatingComponent = new RatingComponent(this.audioRating);
    this.audioRatingComponent.mount();
    this.dotsMenu = new DotsMenuComponent(this.dotsMenuPoint, {
      items: [
        { name: "Add to my songs", handler: () => {} },
        { name: "Lyrics", handler: () => {} },
        { name: "Share", handler: () => {} }
      ]
    });
    this.dotsMenu.mount();
  }

  mount() {
    this.mountPoint.innerHTML = this.render();
    this.querySelectors();
    this.mountChildren();
  }

  render() {
    return playerTemplate({
      src: SONG_INFO.songSrc
    });
  }
}
