function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React from 'react';
import PropTypes from 'prop-types';
import { WidgetPreviewContainer } from 'decap-cms-ui-default';
import DOMPurify from 'dompurify';
import { markdownToHtml } from './serializers';
import { jsx as ___EmotionJSX } from "@emotion/react";
class MarkdownPreview extends React.Component {
  render() {
    const {
      value,
      getAsset,
      resolveWidget,
      field,
      getRemarkPlugins
    } = this.props;
    if (value === null) {
      return null;
    }
    const html = markdownToHtml(value, {
      getAsset,
      resolveWidget
    }, getRemarkPlugins === null || getRemarkPlugins === void 0 ? void 0 : getRemarkPlugins());
    const toRender = field !== null && field !== void 0 && field.get('sanitize_preview', false) ? DOMPurify.sanitize(html) : html;
    return ___EmotionJSX(WidgetPreviewContainer, {
      dangerouslySetInnerHTML: {
        __html: toRender
      }
    });
  }
}
_defineProperty(MarkdownPreview, "propTypes", {
  getAsset: PropTypes.func.isRequired,
  resolveWidget: PropTypes.func.isRequired,
  value: PropTypes.string
});
export default MarkdownPreview;