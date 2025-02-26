import _flatMap from "lodash/flatMap";
import _trimEnd from "lodash/trimEnd";
import _trimStart from "lodash/trimStart";
import _endsWith from "lodash/endsWith";
import _startsWith from "lodash/startsWith";
import _findLast from "lodash/findLast";
import _find from "lodash/find";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import u from 'unist-builder';
import toString from 'mdast-util-to-string';

/**
 * Convert leading and trailing spaces in a link to single spaces outside of the
 * link. MDASTs derived from pasted Google Docs HTML require this treatment.
 *
 * Note that, because we're potentially replacing characters in a link node's
 * children with character's in a link node's siblings, we have to operate on a
 * parent (link) node and its children at once, rather than just processing
 * children one at a time.
 */
export default function remarkPaddedLinks() {
  function transform(node) {
    /**
     * Because we're operating on link nodes and their children at once, we can
     * exit if the current node has no children.
     */
    if (!node.children) return node;

    /**
     * Process a node's children if any of them are links. If a node is a link
     * with leading or trailing spaces, we'll get back an array of nodes instead
     * of a single node, so we use `flatMap` to keep those nodes as siblings
     * with the other children.
     *
     * If performance improvements are found desirable, we could change this to
     * only pass in the link nodes instead of the entire array of children, but
     * this seems unlikely to produce a noticeable perf gain.
     */
    const hasLinkChild = node.children.some(child => child.type === 'link');
    const processedChildren = hasLinkChild ? _flatMap(node.children, transformChildren) : node.children;

    /**
     * Run all children through the transform recursively.
     */
    const children = processedChildren.map(transform);
    return _objectSpread(_objectSpread({}, node), {}, {
      children
    });
  }
  function transformChildren(node) {
    if (node.type !== 'link') return node;

    /**
     * Get the node's complete string value, check for leading and trailing
     * whitespace, and get nodes from each edge where whitespace is found.
     */
    const text = toString(node);
    const leadingWhitespaceNode = _startsWith(text, ' ') && getEdgeTextChild(node);
    const trailingWhitespaceNode = _endsWith(text, ' ') && getEdgeTextChild(node, true);
    if (!leadingWhitespaceNode && !trailingWhitespaceNode) return node;

    /**
     * Trim the edge nodes in place. Unified handles everything in a mutable
     * fashion, so it's often simpler to do the same when working with Unified
     * ASTs.
     */
    if (leadingWhitespaceNode) {
      leadingWhitespaceNode.value = _trimStart(leadingWhitespaceNode.value);
    }
    if (trailingWhitespaceNode) {
      trailingWhitespaceNode.value = _trimEnd(trailingWhitespaceNode.value);
    }

    /**
     * Create an array of nodes. The first and last child will either be `false`
     * or a text node. We filter out the false values before returning.
     */
    const nodes = [leadingWhitespaceNode && u('text', ' '), node, trailingWhitespaceNode && u('text', ' ')];
    return nodes.filter(val => val);
  }

  /**
   * Get the first or last non-blank text child of a node, regardless of
   * nesting. If `end` is truthy, get the last node, otherwise first.
   */
  function getEdgeTextChild(node, end) {
    /**
     * This was changed from a ternary to a long form if due to issues with istanbul's instrumentation and babel's code
     * generation.
     * TODO: watch https://github.com/istanbuljs/babel-plugin-istanbul/issues/95
     * when it is resolved then revert to ```const findFn = end ? findLast : find;```
     */
    let findFn;
    if (end) {
      findFn = _findLast;
    } else {
      findFn = _find;
    }
    let edgeChildWithValue;
    setEdgeChildWithValue(node);
    return edgeChildWithValue;

    /**
     * searchChildren checks a node and all of it's children deeply to find a
     * non-blank text value. When the text node is found, we set it in an outside
     * variable, as it may be deep in the tree and therefore wouldn't be returned
     * by `find`/`findLast`.
     */
    function setEdgeChildWithValue(child) {
      if (!edgeChildWithValue && child.value) {
        edgeChildWithValue = child;
      }
      findFn(child.children, setEdgeChildWithValue);
    }
  }
  return transform;
}