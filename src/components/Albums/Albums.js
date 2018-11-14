import { MDCRipple } from "@material/ripple";

import albumsTemplate from "./Albums.html";
import { MusicService } from "../../services/MusicService";

export class AlbumsComponent {
  constructor(mountPoint, props = {}) {
    this.mountPoint = mountPoint;
    this.props = props;
    this.state = {
      albums: []
    };
  }

  querySelectors() {
    this.albumRipplePoint = this.mountPoint.querySelectorAll(
      ".albums__card-ripple-effect"
    );
    this.albumsContainer = this.mountPoint.querySelector(".albums__container");
  }

  initMaterial() {
    Array.from(this.albumRipplePoint).forEach(el => {
      // eslint-disable-next-line no-new
      new MDCRipple(el);
    });
  }

  fetchAlbumsCollectionData() {
    Promise.all([MusicService.getAlbums(), MusicService.getAuthors()]).then(
      ([albums, authors]) => {
        this.state.albums = albums.map(album => ({
          ...album,
          authors: album.authors
            .map(author => this.getArtistNameById(authors, author))
            .join(", ")
        }));
        this.mount(false);
      }
    );
  }

  addEventsListeners() {
    this.albumsContainer.addEventListener("click", e => {
      e.path.forEach(node => {
        if (node.classList && node.classList.contains("albums__card")) {
          const albumId = node.dataset.id;
          this.props.onAlbumClick(albumId);
        }
      });
    });
  }

  getArtistNameById(authors, id) {
    return authors.find(author => author.id === id).name;
  }

  mount(shouldFetchData = true) {
    if (shouldFetchData) {
      this.fetchAlbumsCollectionData();
      return;
    }
    this.mountPoint.innerHTML = this.render();
    this.querySelectors();
    this.initMaterial();
    this.addEventsListeners();
  }

  render() {
    return albumsTemplate(this.state);
  }
}
