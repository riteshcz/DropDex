"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.API_NAME = void 0;
var _initial2 = _interopRequireDefault(require("lodash/initial"));
var _last2 = _interopRequireDefault(require("lodash/last"));
var _partial2 = _interopRequireDefault(require("lodash/partial"));
var _result2 = _interopRequireDefault(require("lodash/result"));
var _trim2 = _interopRequireDefault(require("lodash/trim"));
var _trimStart2 = _interopRequireDefault(require("lodash/trimStart"));
var _jsBase = require("js-base64");
var _decapCmsLibUtil = require("decap-cms-lib-util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const API_NAME = exports.API_NAME = 'Gitea';
var FileOperation = /*#__PURE__*/function (FileOperation) {
  FileOperation["CREATE"] = "create";
  FileOperation["DELETE"] = "delete";
  FileOperation["UPDATE"] = "update";
  return FileOperation;
}(FileOperation || {});
class API {
  constructor(config) {
    _defineProperty(this, "apiRoot", void 0);
    _defineProperty(this, "token", void 0);
    _defineProperty(this, "branch", void 0);
    _defineProperty(this, "repo", void 0);
    _defineProperty(this, "originRepo", void 0);
    _defineProperty(this, "repoOwner", void 0);
    _defineProperty(this, "repoName", void 0);
    _defineProperty(this, "originRepoOwner", void 0);
    _defineProperty(this, "originRepoName", void 0);
    _defineProperty(this, "repoURL", void 0);
    _defineProperty(this, "originRepoURL", void 0);
    _defineProperty(this, "_userPromise", void 0);
    _defineProperty(this, "_metadataSemaphore", void 0);
    _defineProperty(this, "commitAuthor", void 0);
    this.apiRoot = config.apiRoot || 'https://try.gitea.io/api/v1';
    this.token = config.token || '';
    this.branch = config.branch || 'master';
    this.repo = config.repo || '';
    this.originRepo = config.originRepo || this.repo;
    this.repoURL = `/repos/${this.repo}`;
    this.originRepoURL = `/repos/${this.originRepo}`;
    const [repoParts, originRepoParts] = [this.repo.split('/'), this.originRepo.split('/')];
    this.repoOwner = repoParts[0];
    this.repoName = repoParts[1];
    this.originRepoOwner = originRepoParts[0];
    this.originRepoName = originRepoParts[1];
  }
  user() {
    if (!this._userPromise) {
      this._userPromise = this.getUser();
    }
    return this._userPromise;
  }
  getUser() {
    return this.request('/user');
  }
  async hasWriteAccess() {
    try {
      const result = await this.request(this.repoURL);
      // update config repoOwner to avoid case sensitivity issues with Gitea
      this.repoOwner = result.owner.login;
      return result.permissions.push;
    } catch (error) {
      console.error('Problem fetching repo data from Gitea');
      throw error;
    }
  }
  reset() {
    // no op
  }
  requestHeaders(headers = {}) {
    const baseHeader = _objectSpread({
      'Content-Type': 'application/json; charset=utf-8'
    }, headers);
    if (this.token) {
      baseHeader.Authorization = `token ${this.token}`;
      return Promise.resolve(baseHeader);
    }
    return Promise.resolve(baseHeader);
  }
  async parseJsonResponse(response) {
    const json = await response.json();
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  }
  urlFor(path, options) {
    const params = [];
    if (options.params) {
      for (const key in options.params) {
        params.push(`${key}=${encodeURIComponent(options.params[key])}`);
      }
    }
    if (params.length) {
      path += `?${params.join('&')}`;
    }
    return this.apiRoot + path;
  }
  parseResponse(response) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.match(/json/)) {
      return this.parseJsonResponse(response);
    }
    const textPromise = response.text().then(text => {
      if (!response.ok) {
        return Promise.reject(text);
      }
      return text;
    });
    return textPromise;
  }
  handleRequestError(error, responseStatus) {
    throw new _decapCmsLibUtil.APIError(error.message, responseStatus, API_NAME);
  }
  buildRequest(req) {
    return req;
  }
  async request(path, options = {}, parser = response => this.parseResponse(response)) {
    options = _objectSpread({
      cache: 'no-cache'
    }, options);
    const headers = await this.requestHeaders(options.headers || {});
    const url = this.urlFor(path, options);
    let responseStatus = 500;
    try {
      const req = _decapCmsLibUtil.unsentRequest.fromFetchArguments(url, _objectSpread(_objectSpread({}, options), {}, {
        headers
      }));
      const response = await (0, _decapCmsLibUtil.requestWithBackoff)(this, req);
      responseStatus = response.status;
      const parsedResponse = await parser(response);
      return parsedResponse;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error) {
      return this.handleRequestError(error, responseStatus);
    }
  }
  nextUrlProcessor() {
    return url => url;
  }
  async requestAllPages(url, options = {}) {
    options = _objectSpread({
      cache: 'no-cache'
    }, options);
    const headers = await this.requestHeaders(options.headers || {});
    const processedURL = this.urlFor(url, options);
    const allResponses = await (0, _decapCmsLibUtil.getAllResponses)(processedURL, _objectSpread(_objectSpread({}, options), {}, {
      headers
    }), 'next', this.nextUrlProcessor());
    const pages = await Promise.all(allResponses.map(res => this.parseResponse(res)));
    return [].concat(...pages);
  }
  generateContentKey(collectionName, slug) {
    return (0, _decapCmsLibUtil.generateContentKey)(collectionName, slug);
  }
  parseContentKey(contentKey) {
    return (0, _decapCmsLibUtil.parseContentKey)(contentKey);
  }
  async readFile(path, sha, {
    branch = this.branch,
    repoURL = this.repoURL,
    parseText = true
  } = {}) {
    if (!sha) {
      sha = await this.getFileSha(path, {
        repoURL,
        branch
      });
    }
    const content = await this.fetchBlobContent({
      sha: sha,
      repoURL,
      parseText
    });
    return content;
  }
  async readFileMetadata(path, sha) {
    const fetchFileMetadata = async () => {
      try {
        const result = await this.request(`${this.originRepoURL}/commits`, {
          params: {
            path,
            sha: this.branch,
            stat: 'false'
          }
        });
        const {
          commit
        } = result[0];
        return {
          author: commit.author.name || commit.author.email,
          updatedOn: commit.author.date
        };
      } catch (e) {
        return {
          author: '',
          updatedOn: ''
        };
      }
    };
    const fileMetadata = await (0, _decapCmsLibUtil.readFileMetadata)(sha, fetchFileMetadata, _decapCmsLibUtil.localForage);
    return fileMetadata;
  }
  async fetchBlobContent({
    sha,
    repoURL,
    parseText
  }) {
    const result = await this.request(`${repoURL}/git/blobs/${sha}`, {
      cache: 'force-cache'
    });
    if (parseText) {
      // treat content as a utf-8 string
      const content = _jsBase.Base64.decode(result.content);
      return content;
    } else {
      // treat content as binary and convert to blob
      const content = _jsBase.Base64.atob(result.content);
      const byteArray = new Uint8Array(content.length);
      for (let i = 0; i < content.length; i++) {
        byteArray[i] = content.charCodeAt(i);
      }
      const blob = new Blob([byteArray]);
      return blob;
    }
  }
  async listFiles(path, {
    repoURL = this.repoURL,
    branch = this.branch,
    depth = 1
  } = {}, folderSupport) {
    const folder = (0, _trim2.default)(path, '/');
    try {
      const result = await this.request(`${repoURL}/git/trees/${branch}:${encodeURIComponent(folder)}`, {
        // Gitea API supports recursive=1 for getting the entire recursive tree
        // or omitting it to get the non-recursive tree
        params: depth > 1 ? {
          recursive: 1
        } : {}
      });
      return result.tree
      // filter only files and/or folders up to the required depth
      .filter(file => (!folderSupport ? file.type === 'blob' : true) && decodeURIComponent(file.path).split('/').length <= depth).map(file => ({
        type: file.type,
        id: file.sha,
        name: (0, _decapCmsLibUtil.basename)(file.path),
        path: `${folder}/${file.path}`,
        size: file.size
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err) {
      if (err && err.status === 404) {
        console.info('[StaticCMS] This 404 was expected and handled appropriately.');
        return [];
      } else {
        throw err;
      }
    }
  }
  async persistFiles(dataFiles, mediaFiles, options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files = mediaFiles.concat(dataFiles);
    const operations = await this.getChangeFileOperations(files, this.branch);
    return this.changeFiles(operations, options);
  }
  async changeFiles(operations, options) {
    return await this.request(`${this.repoURL}/contents`, {
      method: 'POST',
      body: JSON.stringify({
        branch: this.branch,
        files: operations,
        message: options.commitMessage
      })
    });
  }
  async getChangeFileOperations(files, branch) {
    const items = await Promise.all(files.map(async file => {
      const content = await (0, _result2.default)(file, 'toBase64', (0, _partial2.default)(this.toBase64, file.raw));
      let sha;
      let operation;
      let from_path;
      let path = (0, _trimStart2.default)(file.path, '/');
      try {
        sha = await this.getFileSha(file.path, {
          branch
        });
        operation = FileOperation.UPDATE;
        from_path = file.newPath && path;
        path = file.newPath ? (0, _trimStart2.default)(file.newPath, '/') : path;
      } catch {
        sha = undefined;
        operation = FileOperation.CREATE;
      }
      return {
        operation,
        content,
        path,
        from_path,
        sha
      };
    }));
    return items;
  }
  async getFileSha(path, {
    repoURL = this.repoURL,
    branch = this.branch
  } = {}) {
    /**
     * We need to request the tree first to get the SHA. We use extended SHA-1
     * syntax (<rev>:<path>) to get a blob from a tree without having to recurse
     * through the tree.
     */

    const pathArray = path.split('/');
    const filename = (0, _last2.default)(pathArray);
    const directory = (0, _initial2.default)(pathArray).join('/');
    const fileDataPath = encodeURIComponent(directory);
    const fileDataURL = `${repoURL}/git/trees/${branch}:${fileDataPath}`;
    const result = await this.request(fileDataURL);
    const file = result.tree.find(file => file.path === filename);
    if (file) {
      return file.sha;
    } else {
      throw new _decapCmsLibUtil.APIError('Not Found', 404, API_NAME);
    }
  }
  async deleteFiles(paths, message) {
    const operations = await Promise.all(paths.map(async path => {
      const sha = await this.getFileSha(path);
      return {
        operation: FileOperation.DELETE,
        path,
        sha
      };
    }));
    this.changeFiles(operations, {
      commitMessage: message
    });
  }
  toBase64(str) {
    return Promise.resolve(_jsBase.Base64.encode(str));
  }
}
exports.default = API;
_defineProperty(API, "DEFAULT_COMMIT_MESSAGE", 'Automatically generated by Static CMS');