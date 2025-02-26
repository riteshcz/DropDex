import _has from "lodash/has";
import _map from "lodash/map";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React from 'react';
import { renderToString } from 'react-dom/server';
import u from 'unist-builder';

/**
 * This plugin doesn't actually transform Remark (MDAST) nodes to Rehype
 * (HAST) nodes, but rather, it prepares an MDAST shortcode node for HAST
 * conversion by replacing the shortcode text with stringified HTML for
 * previewing the shortcode output.
 */
export default function remarkToRehypeShortcodes({
  plugins,
  getAsset,
  resolveWidget
}) {
  return transform;
  function transform(root) {
    const transformedChildren = _map(root.children, processShortcodes);
    return _objectSpread(_objectSpread({}, root), {}, {
      children: transformedChildren
    });
  }

  /**
   * Mapping function to transform nodes that contain shortcodes.
   */
  function processShortcodes(node) {
    /**
     * If the node doesn't contain shortcode data, return the original node.
     */
    if (!_has(node, ['data', 'shortcode'])) return node;

    /**
     * Get shortcode data from the node, and retrieve the matching plugin by
     * key.
     */
    const {
      shortcode,
      shortcodeData
    } = node.data;
    const plugin = plugins.get(shortcode);

    /**
     * Run the shortcode plugin's `toPreview` method, which will return either
     * an HTML string or a React component. If a React component is returned,
     * render it to an HTML string.
     */
    const value = getPreview(plugin, shortcodeData);
    const valueHtml = typeof value === 'string' ? value : renderToString(value);

    /**
     * Return a new 'html' type node containing the shortcode preview markup.
     */
    const textNode = u('html', valueHtml);
    const children = [textNode];
    return _objectSpread(_objectSpread({}, node), {}, {
      children
    });
  }

  /**
   * Retrieve the shortcode preview component.
   */
  function getPreview(plugin, shortcodeData) {
    const {
      toPreview,
      widget,
      fields
    } = plugin;
    if (toPreview) {
      return toPreview(shortcodeData, getAsset, fields);
    }
    const preview = resolveWidget(widget);
    return /*#__PURE__*/React.createElement(preview.preview, {
      value: shortcodeData,
      field: plugin,
      getAsset
    });
  }
}