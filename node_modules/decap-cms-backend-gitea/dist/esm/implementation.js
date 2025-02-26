"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _commonTags = require("common-tags");
var _trimStart = _interopRequireDefault(require("lodash/trimStart"));
var _semaphore = _interopRequireDefault(require("semaphore"));
var _decapCmsLibUtil = require("decap-cms-lib-util");
var _API = _interopRequireWildcard(require("./API"));
var _AuthenticationPage = _interopRequireDefault(require("./AuthenticationPage"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const MAX_CONCURRENT_DOWNLOADS = 10;
const {
  fetchWithTimeout: fetch
} = _decapCmsLibUtil.unsentRequest;
class Gitea {
  constructor(config, options = {}) {
    var _config$backend$branc;
    _defineProperty(this, "lock", void 0);
    _defineProperty(this, "api", void 0);
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "originRepo", void 0);
    _defineProperty(this, "repo", void 0);
    _defineProperty(this, "branch", void 0);
    _defineProperty(this, "apiRoot", void 0);
    _defineProperty(this, "mediaFolder", void 0);
    _defineProperty(this, "token", void 0);
    _defineProperty(this, "_currentUserPromise", void 0);
    _defineProperty(this, "_userIsOriginMaintainerPromises", void 0);
    _defineProperty(this, "_mediaDisplayURLSem", void 0);
    _defineProperty(this, "getCursorAndFiles", (files, page) => {
      const pageSize = 20;
      const count = files.length;
      const pageCount = Math.ceil(files.length / pageSize);
      const actions = [];
      if (page > 1) {
        actions.push('prev');
        actions.push('first');
      }
      if (page < pageCount) {
        actions.push('next');
        actions.push('last');
      }
      const cursor = _decapCmsLibUtil.Cursor.create({
        actions,
        meta: {
          page,
          count,
          pageSize,
          pageCount
        },
        data: {
          files
        }
      });
      const pageFiles = files.slice((page - 1) * pageSize, page * pageSize);
      return {
        cursor,
        files: pageFiles
      };
    });
    this.options = _objectSpread({
      proxied: false,
      API: null,
      useWorkflow: false
    }, options);
    if (!this.options.proxied && (config.backend.repo === null || config.backend.repo === undefined)) {
      throw new Error('The Gitea backend needs a "repo" in the backend configuration.');
    }
    if (this.options.useWorkflow) {
      throw new Error('The Gitea backend does not support editorial workflow.');
    }
    this.api = this.options.API || null;
    this.repo = this.originRepo = config.backend.repo || '';
    this.branch = ((_config$backend$branc = config.backend.branch) === null || _config$backend$branc === void 0 ? void 0 : _config$backend$branc.trim()) || 'master';
    this.apiRoot = config.backend.api_root || 'https://try.gitea.io/api/v1';
    this.token = '';
    this.mediaFolder = config.media_folder;
    this.lock = (0, _decapCmsLibUtil.asyncLock)();
  }
  isGitBackend() {
    return true;
  }
  async status() {
    var _this$api;
    const auth = (await ((_this$api = this.api) === null || _this$api === void 0 ? void 0 : _this$api.user().then(user => !!user).catch(e => {
      console.warn('[StaticCMS] Failed getting Gitea user', e);
      return false;
    }))) || false;
    return {
      auth: {
        status: auth
      },
      api: {
        status: true,
        statusPage: ''
      }
    };
  }
  authComponent() {
    return _AuthenticationPage.default;
  }
  restoreUser(user) {
    return this.authenticate(user);
  }
  async currentUser({
    token
  }) {
    if (!this._currentUserPromise) {
      this._currentUserPromise = fetch(`${this.apiRoot}/user`, {
        headers: {
          Authorization: `token ${token}`
        }
      }).then(res => res.json());
    }
    return this._currentUserPromise;
  }
  async userIsOriginMaintainer({
    username: usernameArg,
    token
  }) {
    const username = usernameArg || (await this.currentUser({
      token
    })).login;
    this._userIsOriginMaintainerPromises = this._userIsOriginMaintainerPromises || {};
    if (!this._userIsOriginMaintainerPromises[username]) {
      this._userIsOriginMaintainerPromises[username] = fetch(`${this.apiRoot}/repos/${this.originRepo}/collaborators/${username}/permission`, {
        headers: {
          Authorization: `token ${token}`
        }
      }).then(res => res.json()).then(({
        permission
      }) => permission === 'admin' || permission === 'write');
    }
    return this._userIsOriginMaintainerPromises[username];
  }
  async authenticate(state) {
    this.token = state.token;
    const apiCtor = _API.default;
    this.api = new apiCtor({
      token: this.token,
      branch: this.branch,
      repo: this.repo,
      originRepo: this.originRepo,
      apiRoot: this.apiRoot
    });
    const user = await this.api.user();
    const isCollab = await this.api.hasWriteAccess().catch(error => {
      error.message = (0, _commonTags.stripIndent)`
        Repo "${this.repo}" not found.

        Please ensure the repo information is spelled correctly.

        If the repo is private, make sure you're logged into a Gitea account with access.

        If your repo is under an organization, ensure the organization has granted access to Static
        CMS.
      `;
      throw error;
    });

    // Unauthorized user
    if (!isCollab) {
      throw new Error('Your Gitea user account does not have access to this repo.');
    }

    // Authorized user
    return {
      name: user.full_name,
      login: user.login,
      avatar_url: user.avatar_url,
      token: state.token
    };
  }
  logout() {
    this.token = null;
    if (this.api && this.api.reset && typeof this.api.reset === 'function') {
      return this.api.reset();
    }
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  async entriesByFolder(folder, extension, depth) {
    const repoURL = this.api.originRepoURL;
    let cursor;
    const listFiles = () => this.api.listFiles(folder, {
      repoURL,
      depth
    }).then(files => {
      const filtered = files.filter(file => (0, _decapCmsLibUtil.filterByExtension)(file, extension));
      const result = this.getCursorAndFiles(filtered, 1);
      cursor = result.cursor;
      return result.files;
    });
    const readFile = (path, id) => this.api.readFile(path, id, {
      repoURL
    });
    const files = await (0, _decapCmsLibUtil.entriesByFolder)(listFiles, readFile, this.api.readFileMetadata.bind(this.api), _API.API_NAME);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    files[_decapCmsLibUtil.CURSOR_COMPATIBILITY_SYMBOL] = cursor;
    return files;
  }
  async allEntriesByFolder(folder, extension, depth) {
    const repoURL = this.api.originRepoURL;
    const listFiles = () => this.api.listFiles(folder, {
      repoURL,
      depth
    }).then(files => files.filter(file => (0, _decapCmsLibUtil.filterByExtension)(file, extension)));
    const readFile = (path, id) => {
      return this.api.readFile(path, id, {
        repoURL
      });
    };
    const files = await (0, _decapCmsLibUtil.entriesByFolder)(listFiles, readFile, this.api.readFileMetadata.bind(this.api), _API.API_NAME);
    return files;
  }
  entriesByFiles(files) {
    const repoURL = this.api.repoURL;
    const readFile = (path, id) => this.api.readFile(path, id, {
      repoURL
    }).catch(() => '');
    return (0, _decapCmsLibUtil.entriesByFiles)(files, readFile, this.api.readFileMetadata.bind(this.api), _API.API_NAME);
  }

  // Fetches a single entry.
  getEntry(path) {
    const repoURL = this.api.originRepoURL;
    return this.api.readFile(path, null, {
      repoURL
    }).then(data => ({
      file: {
        path,
        id: null
      },
      data: data
    })).catch(() => ({
      file: {
        path,
        id: null
      },
      data: ''
    }));
  }
  async getMedia(mediaFolder = this.mediaFolder, folderSupport) {
    if (!mediaFolder) {
      return [];
    }
    return this.api.listFiles(mediaFolder, undefined, folderSupport).then(files => files.map(({
      id,
      name,
      size,
      path,
      type
    }) => {
      return {
        id,
        name,
        size,
        displayURL: {
          id,
          path
        },
        path,
        isDirectory: type === 'tree'
      };
    }));
  }
  async getMediaFile(path) {
    const blob = await (0, _decapCmsLibUtil.getMediaAsBlob)(path, null, this.api.readFile.bind(this.api));
    const name = (0, _decapCmsLibUtil.basename)(path);
    const fileObj = (0, _decapCmsLibUtil.blobToFileObj)(name, blob);
    const url = URL.createObjectURL(fileObj);
    const id = await (0, _decapCmsLibUtil.getBlobSHA)(blob);
    return {
      id,
      displayURL: url,
      path,
      name,
      size: fileObj.size,
      file: fileObj,
      url
    };
  }
  getMediaDisplayURL(displayURL) {
    this._mediaDisplayURLSem = this._mediaDisplayURLSem || (0, _semaphore.default)(MAX_CONCURRENT_DOWNLOADS);
    return (0, _decapCmsLibUtil.getMediaDisplayURL)(displayURL, this.api.readFile.bind(this.api), this._mediaDisplayURLSem);
  }
  persistEntry(entry, options) {
    // persistEntry is a transactional operation
    return (0, _decapCmsLibUtil.runWithLock)(this.lock, () => this.api.persistFiles(entry.dataFiles, entry.assets, options), 'Failed to acquire persist entry lock');
  }
  async persistMedia(mediaFile, options) {
    try {
      await this.api.persistFiles([], [mediaFile], options);
      const {
        sha,
        path,
        fileObj
      } = mediaFile;
      const displayURL = URL.createObjectURL(fileObj);
      return {
        id: sha,
        name: fileObj.name,
        size: fileObj.size,
        displayURL,
        path: (0, _trimStart.default)(path, '/')
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  deleteFiles(paths, commitMessage) {
    return this.api.deleteFiles(paths, commitMessage);
  }
  async traverseCursor(cursor, action) {
    const meta = cursor.meta;
    const files = cursor.data.get('files').toJS();
    let result;
    switch (action) {
      case 'first':
        {
          result = this.getCursorAndFiles(files, 1);
          break;
        }
      case 'last':
        {
          result = this.getCursorAndFiles(files, meta.get('pageCount'));
          break;
        }
      case 'next':
        {
          result = this.getCursorAndFiles(files, meta.get('page') + 1);
          break;
        }
      case 'prev':
        {
          result = this.getCursorAndFiles(files, meta.get('page') - 1);
          break;
        }
      default:
        {
          result = this.getCursorAndFiles(files, 1);
          break;
        }
    }
    const readFile = (path, id) => this.api.readFile(path, id, {
      repoURL: this.api.originRepoURL
    }).catch(() => '');
    const entries = await (0, _decapCmsLibUtil.entriesByFiles)(result.files, readFile, this.api.readFileMetadata.bind(this.api), _API.API_NAME);
    return {
      entries,
      cursor: result.cursor
    };
  }
  async unpublishedEntries() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {};
  }
  async unpublishedEntry() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {};
  }
  async unpublishedEntryDataFile() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {};
  }
  async unpublishedEntryMediaFile() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {};
  }
  async updateUnpublishedEntryStatus() {
    return;
  }
  async publishUnpublishedEntry() {
    return;
  }
  async deleteUnpublishedEntry() {
    return;
  }
  async getDeployPreview() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {};
  }
}
exports.default = Gitea;