function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { Editor, Transforms } from 'slate';
import isSelectionWithinNoninitialListItem from '../locations/isSelectionWithinNoninitialListItem';
import lowestMatchedAncestor from '../../matchers/lowestMatchedAncestor';
import moveListToListItem from '../transforms/moveListToListItem';
function keyDownTab(editor) {
  if (!editor.selection) return;
  if (!isSelectionWithinNoninitialListItem(editor)) return;

  // In a case where one edge of the range is within a nested list item, we need to even the selection to the outer most level
  const {
    focus,
    anchor
  } = editor.selection;
  const pathLength = focus.path.length > anchor.path.length ? anchor.path.length : focus.path.length;
  const at = {
    anchor: {
      offset: 0,
      path: [...anchor.path.slice(0, pathLength - 2), 0, 0]
    },
    focus: {
      offset: 0,
      path: [...focus.path.slice(0, pathLength - 2), 0, 0]
    }
  };
  Editor.withoutNormalizing(editor, () => {
    // wrap selected list items into a new bulleted list
    Transforms.wrapNodes(editor, {
      type: 'bulleted-list'
    }, _objectSpread(_objectSpread({}, lowestMatchedAncestor(editor, 'list-item')), {}, {
      at
    }));

    // get the new bulleted list position
    const [, newListPath] = Editor.above(editor, lowestMatchedAncestor(editor, 'list'));

    // get the new parent node (previous list item)
    const parentNode = Editor.previous(editor, {
      at: newListPath
    });
    moveListToListItem(editor, newListPath, parentNode);
  });
  Editor.normalize(editor);
}
export default keyDownTab;