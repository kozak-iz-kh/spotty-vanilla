import mySongsTemplate from "./MySongs.html";
import { SongsTableComponent } from "../SongsTable/SongsTable";
import { MusicService } from "../../services/MusicService";
import { AuthService } from "../../services/AuthService";
import { SearchFunctionalityProviderComponent } from "../SearchFunctionalityProvider/SearchFunctionalityProvider";
import { Loader } from "../Loader/Loader";

export class MySongsComponent extends SearchFunctionalityProviderComponent {
  constructor(mountPoint, props = {}) {
    super();
    this.mountPoint = mountPoint;
    this.props = props;
    this.state = {
      isFetching: false,
      initialData: null,
      filteredData: null
    };
  }

  handleSearchQuery(term) {
    super.handleSearchQuery.call(this, term);
    this.mount(false, this.state.filteredData);
  }

  querySelectors() {
    if (this.state.isFetching) {
      this.loaderContainer = this.mountPoint.querySelector(".artists__loader");
    } else {
      this.loaderContainer = null;
    }
    this.tableContainer = this.mountPoint.querySelector(
      ".my-songs__table-container"
    );
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
    const userId = AuthService.getCurrentUser().uid;
    return MusicService.getUserSongs(userId)
      .then(songs => {
        this.state.initialData = songs;

        return Promise.all(
          this.state.initialData.map(song => this.fetchInfoBySong(song))
        );
      })
      .then(songsInfo => {
        songsInfo.forEach((item, i) => {
          const [album, authorsInfo] = item;

          this.state.initialData[i].album = album;
          this.state.initialData[i].authorsInfo = authorsInfo;
        });

        this.state.filteredData = [...this.state.initialData];
        this.state.isFetching = false;
      });
  }

  changeStateSong(songId, isPlaying) {
    this.playingSongId = isPlaying ? songId : null;
    if (this.mountPoint.querySelector(".my-songs")) {
      this.table.changeStateSong(songId, isPlaying);
    }
  }

  handleRemoveSong(songId) {
    MusicService.removeUserSong(AuthService.getCurrentUser().uid, songId).then(
      () => this.mount()
    );
  }

  addSong() {
    if (this.mountPoint.querySelector(".my-songs")) {
      this.mount();
    }
  }

  getNewData() {
    this.mount(true);
  }

  mountChildren(data) {
    this.table = new SongsTableComponent(this.tableContainer, {
      data,
      dragAndDrop: true,
      onSongPlay: this.props.onSongPlay,
      onSongStop: this.props.onSongStop,
      onSongRemove: this.handleRemoveSong.bind(this),
      onDialogOpen: this.props.onDialogOpen,
      onLegalOptionClick: this.props.onLegalOptionClick,
      playingSongId: this.playingSongId,
      hasRemoveBtn: true,
      onDragnDrop: this.getNewData.bind(this)
    });
    this.table.mount();
  }

  mount(
    shouldFetchData = true,
    data = this.state.initialData ? [...this.state.initialData] : []
  ) {
    if (shouldFetchData) {
      this.state.isFetching = true;
      this.fetchSongs().then(() => this.mount(false));
    }
    this.mountPoint.innerHTML = this.render();
    this.querySelectors();
    this.mountLoader();
    if (!this.state.isFetching && data.length) {
      this.mountChildren(data);
      this.props.onDataReceived(data);
    }
  }

  mountLoader() {
    if (this.state.isFetching) {
      this.loader = new Loader(this.loaderContainer);
      this.loader.mount();
    } else {
      this.loader = null;
    }
  }

  render() {
    const { isFetching, initialData } = this.state;
    return mySongsTemplate({
      isFetching,
      hasSongs: initialData ? initialData.length : false
    });
  }
}
