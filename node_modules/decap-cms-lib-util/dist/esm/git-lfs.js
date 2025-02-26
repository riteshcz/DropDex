import _map from "lodash/fp/map";
import _fromPairs from "lodash/fp/fromPairs";
import _flow from "lodash/fp/flow";
import _filter from "lodash/fp/filter"; //
// Pointer file parsing
const _excluded = ["size", "oid"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import getBlobSHA from './getBlobSHA';
function splitIntoLines(str) {
  return str.split('\n');
}
function splitIntoWords(str) {
  return str.split(/\s+/g);
}
function isNonEmptyString(str) {
  return str !== '';
}
const withoutEmptyLines = _flow([_map(str => str.trim()), _filter(isNonEmptyString)]);
export const parsePointerFile = _flow([splitIntoLines, withoutEmptyLines, _map(splitIntoWords), _fromPairs, _ref => {
  let {
      size,
      oid
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return _objectSpread({
    size: parseInt(size),
    sha: oid === null || oid === void 0 ? void 0 : oid.split(':')[1]
  }, rest);
}]);

//
// .gitattributes file parsing

function removeGitAttributesCommentsFromLine(line) {
  return line.split('#')[0];
}
function parseGitPatternAttribute(attributeString) {
  // There are three kinds of attribute settings:
  // - a key=val pair sets an attribute to a specific value
  // - a key without a value and a leading hyphen sets an attribute to false
  // - a key without a value and no leading hyphen sets an attribute
  //   to true
  if (attributeString.includes('=')) {
    return attributeString.split('=');
  }
  if (attributeString.startsWith('-')) {
    return [attributeString.slice(1), false];
  }
  return [attributeString, true];
}
const parseGitPatternAttributes = _flow([_map(parseGitPatternAttribute), _fromPairs]);
const parseGitAttributesPatternLine = _flow([splitIntoWords, ([pattern, ...attributes]) => [pattern, parseGitPatternAttributes(attributes)]]);
const parseGitAttributesFileToPatternAttributePairs = _flow([splitIntoLines, _map(removeGitAttributesCommentsFromLine), withoutEmptyLines, _map(parseGitAttributesPatternLine)]);
export const getLargeMediaPatternsFromGitAttributesFile = _flow([parseGitAttributesFileToPatternAttributePairs, _filter(([, attributes]) => attributes.filter === 'lfs' && attributes.diff === 'lfs' && attributes.merge === 'lfs'), _map(([pattern]) => pattern)]);
export function createPointerFile({
  size,
  sha
}) {
  return `\
version https://git-lfs.github.com/spec/v1
oid sha256:${sha}
size ${size}
`;
}
export async function getPointerFileForMediaFileObj(client, fileObj, path) {
  const {
    name,
    size
  } = fileObj;
  const sha = await getBlobSHA(fileObj);
  await client.uploadResource({
    sha,
    size
  }, fileObj);
  const pointerFileString = createPointerFile({
    sha,
    size
  });
  const pointerFileBlob = new Blob([pointerFileString]);
  const pointerFile = new File([pointerFileBlob], name, {
    type: 'text/plain'
  });
  const pointerFileSHA = await getBlobSHA(pointerFile);
  return {
    fileObj: pointerFile,
    size: pointerFileBlob.size,
    sha: pointerFileSHA,
    raw: pointerFileString,
    path
  };
}
export async function getLargeMediaFilteredMediaFiles(client, mediaFiles) {
  return await Promise.all(mediaFiles.map(async mediaFile => {
    const {
      fileObj,
      path
    } = mediaFile;
    const fixedPath = path.startsWith('/') ? path.slice(1) : path;
    if (!client.matchPath(fixedPath)) {
      return mediaFile;
    }
    const pointerFileDetails = await getPointerFileForMediaFileObj(client, fileObj, path);
    return _objectSpread(_objectSpread({}, mediaFile), pointerFileDetails);
  }));
}