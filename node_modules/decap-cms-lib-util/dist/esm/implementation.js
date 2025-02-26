import _sortBy from "lodash/sortBy";
import _unionBy from "lodash/unionBy";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import semaphore from 'semaphore';
import { basename } from './path';
const MAX_CONCURRENT_DOWNLOADS = 10;
async function fetchFiles(files, readFile, readFileMetadata, apiName) {
  const sem = semaphore(MAX_CONCURRENT_DOWNLOADS);
  const promises = [];
  files.forEach(file => {
    promises.push(new Promise(resolve => sem.take(async () => {
      try {
        const [data, fileMetadata] = await Promise.all([readFile(file.path, file.id, {
          parseText: true
        }), readFileMetadata(file.path, file.id)]);
        resolve({
          file: _objectSpread(_objectSpread({}, file), fileMetadata),
          data: data
        });
        sem.leave();
      } catch (error) {
        sem.leave();
        console.error(`failed to load file from ${apiName}: ${file.path}`);
        resolve({
          error: true
        });
      }
    })));
  });
  return Promise.all(promises).then(loadedEntries => loadedEntries.filter(loadedEntry => !loadedEntry.error));
}
export async function entriesByFolder(listFiles, readFile, readFileMetadata, apiName) {
  const files = await listFiles();
  return fetchFiles(files, readFile, readFileMetadata, apiName);
}
export async function entriesByFiles(files, readFile, readFileMetadata, apiName) {
  return fetchFiles(files, readFile, readFileMetadata, apiName);
}
export async function unpublishedEntries(listEntriesKeys) {
  try {
    const keys = await listEntriesKeys();
    return keys;
  } catch (error) {
    if (error.message === 'Not Found') {
      return Promise.resolve([]);
    }
    throw error;
  }
}
export function blobToFileObj(name, blob) {
  const options = name.match(/.svg$/) ? {
    type: 'image/svg+xml'
  } : {};
  return new File([blob], name, options);
}
export async function getMediaAsBlob(path, id, readFile) {
  let blob;
  if (path.match(/.svg$/)) {
    const text = await readFile(path, id, {
      parseText: true
    });
    blob = new Blob([text], {
      type: 'image/svg+xml'
    });
  } else {
    blob = await readFile(path, id, {
      parseText: false
    });
  }
  return blob;
}
export async function getMediaDisplayURL(displayURL, readFile, semaphore) {
  const {
    path,
    id
  } = displayURL;
  return new Promise((resolve, reject) => semaphore.take(() => getMediaAsBlob(path, id, readFile).then(blob => URL.createObjectURL(blob)).then(resolve, reject).finally(() => semaphore.leave())));
}
export async function runWithLock(lock, func, message) {
  try {
    const acquired = await lock.acquire();
    if (!acquired) {
      console.warn(message);
    }
    const result = await func();
    return result;
  } finally {
    lock.release();
  }
}
const LOCAL_KEY = 'git.local';
function getLocalKey({
  branch,
  folder,
  extension,
  depth
}) {
  return `${LOCAL_KEY}.${branch}.${folder}.${extension}.${depth}`;
}
export async function persistLocalTree({
  localForage,
  localTree,
  branch,
  folder,
  extension,
  depth
}) {
  await localForage.setItem(getLocalKey({
    branch,
    folder,
    extension,
    depth
  }), localTree);
}
export async function getLocalTree({
  localForage,
  branch,
  folder,
  extension,
  depth
}) {
  const localTree = await localForage.getItem(getLocalKey({
    branch,
    folder,
    extension,
    depth
  }));
  return localTree;
}
async function getDiffFromLocalTree({
  branch,
  localTree,
  folder,
  getDifferences,
  filterFile,
  getFileId
}) {
  const diff = await getDifferences(branch.sha, localTree.head);
  const diffFiles = diff.filter(d => {
    var _d$oldPath, _d$newPath;
    return ((_d$oldPath = d.oldPath) === null || _d$oldPath === void 0 ? void 0 : _d$oldPath.startsWith(folder)) || ((_d$newPath = d.newPath) === null || _d$newPath === void 0 ? void 0 : _d$newPath.startsWith(folder));
  }).reduce((acc, d) => {
    if (d.status === 'renamed') {
      acc.push({
        path: d.oldPath,
        name: basename(d.oldPath),
        deleted: true
      });
      acc.push({
        path: d.newPath,
        name: basename(d.newPath),
        deleted: false
      });
    } else if (d.status === 'deleted') {
      acc.push({
        path: d.oldPath,
        name: basename(d.oldPath),
        deleted: true
      });
    } else {
      acc.push({
        path: d.newPath || d.oldPath,
        name: basename(d.newPath || d.oldPath),
        deleted: false
      });
    }
    return acc;
  }, []).filter(filterFile);
  const diffFilesWithIds = await Promise.all(diffFiles.map(async file => {
    if (!file.deleted) {
      const id = await getFileId(file.path);
      return _objectSpread(_objectSpread({}, file), {}, {
        id
      });
    } else {
      return _objectSpread(_objectSpread({}, file), {}, {
        id: ''
      });
    }
  }));
  return diffFilesWithIds;
}
export async function allEntriesByFolder({
  listAllFiles,
  readFile,
  readFileMetadata,
  apiName,
  branch,
  localForage,
  folder,
  extension,
  depth,
  getDefaultBranch,
  isShaExistsInBranch,
  getDifferences,
  getFileId,
  filterFile,
  customFetch
}) {
  async function listAllFilesAndPersist() {
    const files = await listAllFiles(folder, extension, depth);
    const branch = await getDefaultBranch();
    await persistLocalTree({
      localForage,
      localTree: {
        head: branch.sha,
        files: files.map(f => ({
          id: f.id,
          path: f.path,
          name: basename(f.path)
        }))
      },
      branch: branch.name,
      depth,
      extension,
      folder
    });
    return files;
  }
  async function listFiles() {
    const localTree = await getLocalTree({
      localForage,
      branch,
      folder,
      extension,
      depth
    });
    if (localTree) {
      const branch = await getDefaultBranch();
      // if the branch was forced pushed the local tree sha can be removed from the remote tree
      const localTreeInBranch = await isShaExistsInBranch(branch.name, localTree.head);
      if (!localTreeInBranch) {
        console.log(`Can't find local tree head '${localTree.head}' in branch '${branch.name}', rebuilding local tree`);
        return listAllFilesAndPersist();
      }
      const diff = await getDiffFromLocalTree({
        branch,
        localTree,
        folder,
        extension,
        depth,
        getDifferences,
        getFileId,
        filterFile
      }).catch(e => {
        console.log('Failed getting diff from local tree:', e);
        return null;
      });
      if (!diff) {
        console.log(`Diff is null, rebuilding local tree`);
        return listAllFilesAndPersist();
      }
      if (diff.length === 0) {
        // return local copy
        return localTree.files;
      } else {
        const deleted = diff.reduce((acc, d) => {
          acc[d.path] = d.deleted;
          return acc;
        }, {});
        const newCopy = _sortBy(_unionBy(diff.filter(d => !deleted[d.path]), localTree.files.filter(f => !deleted[f.path]), file => file.path), file => file.path);
        await persistLocalTree({
          localForage,
          localTree: {
            head: branch.sha,
            files: newCopy
          },
          branch: branch.name,
          depth,
          extension,
          folder
        });
        return newCopy;
      }
    } else {
      return listAllFilesAndPersist();
    }
  }
  const files = await listFiles();
  if (customFetch) {
    return await customFetch(files);
  }
  return await fetchFiles(files, readFile, readFileMetadata, apiName);
}