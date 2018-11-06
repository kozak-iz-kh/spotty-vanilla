import { MusicService } from "../../services/MusicService";
import { SongsTableComponent } from "../SongsTable/SongsTable";
import artistSongTable from "./ArtistSongTable.html";

export class ArtistSongTableComponent {
  constructor(mountPoint, props = {}) {
    this.mountPoint = mountPoint;
    this.props = props;
    this.songs = [];
  }

  querySelectors() {
    this.tableContainer = this.mountPoint.querySelector(".table-container");
  }

  fetchAuthors(authorsIds) {
    return Promise.all(
      authorsIds.map(authorId => MusicService.getAuthorById(authorId))
    );
  }

  fetchInfoBySong(song) {
    const albumPromise = MusicService.getAlbumById(song.albumId);
    const authorsPromise = this.fetchAuthors(song.authors);

    return Promise.all([albumPromise, authorsPromise]);
  }

  fetchSongs() {
    MusicService.getAuthorSongs("author4")
      .then(songs => {
        this.songs = songs;

        return Promise.all(this.songs.map(song => this.fetchInfoBySong(song)));
      })
      .then(songsInfo => {
        songsInfo.forEach((item, i) => {
          const [album, authorsInfo] = item;

          this.songs[i].album = album;
          this.songs[i].authorsInfo = authorsInfo;
        });

        this.mount(false);
      });
  }

  mountChildren() {
    this.table = new SongsTableComponent(this.tableContainer, {
      data: this.songs,
      onSongPlay: this.props.onSongPlay
    });
    this.table.mount();
  }

  mount(shouldFetchData = true) {
    if (shouldFetchData) {
      this.fetchSongs();
    }
    this.mountPoint.innerHTML = this.render();
    this.querySelectors();
    this.mountChildren();
  }

  render() {
    return artistSongTable();
  }
}