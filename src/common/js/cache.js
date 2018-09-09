import storage from "good-storage";

const SEARCH_KEY = "__search__";
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = "__play__";
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KET = "__favorite__";
const FAVORITE_MAX_LENGTH = 200;

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function saveSearch(query) {
  let seaches = storage.get(SEARCH_KEY, []);
  insertArray(
    seaches,
    query,
    item => {
      return item === query;
    },
    SEARCH_MAX_LENGTH
  );
  storage.set(SEARCH_KEY, seaches);
  return seaches;
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

export function deleteSearch(query) {
  let seaches = storage.get(SEARCH_KEY, []);
  deleteFromArray(seaches, item => {
    return item === query;
  });
  storage.set(SEARCH_KEY, seaches);
  return seaches;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []);
  insertArray(
    songs,
    song,
    item => {
      return item.id === song.id;
    },
    PLAY_MAX_LENGTH
  );
  storage.set(PLAY_KEY, songs);
  return songs;
}

export function loadPlay() {
  return storage.get(PLAY_KEY, []);
}

export const saveFavorite = function(song) {
  let songs = storage.get(FAVORITE_KET, []);
  insertArray(
    songs,
    song,
    item => {
      return item.id === song.id;
    },
    FAVORITE_MAX_LENGTH
  );
  storage.set(FAVORITE_KET, songs);
  return songs;
};

export const deleteFavorite = function(song) {
  let songs = storage.get(FAVORITE_KET, []);
  deleteFromArray(
    songs,
    item => {
      return item.id === song.id;
    },
    FAVORITE_MAX_LENGTH
  );
  storage.set(FAVORITE_KET, songs);
  return songs;
};

export const loadFavorite = function() {
  return storage.get(FAVORITE_KET, []);
};
