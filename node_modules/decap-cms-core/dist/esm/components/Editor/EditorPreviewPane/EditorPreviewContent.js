function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React from 'react';
import { isElement } from 'react-is';
import { ScrollSyncPane } from 'react-scroll-sync';
import { FrameContextConsumer } from 'react-frame-component';
import { vercelStegaDecode } from '@vercel/stega';

/**
 * PreviewContent renders the preview component and optionally handles visual editing interactions.
 * By default it uses scroll sync, but can be configured to use visual editing instead.
 */
import { jsx as ___EmotionJSX } from "@emotion/react";
class PreviewContent extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "handleClick", e => {
      var _previewProps$collect;
      const {
        previewProps,
        onFieldClick
      } = this.props;
      const visualEditing = previewProps === null || previewProps === void 0 ? void 0 : (_previewProps$collect = previewProps.collection) === null || _previewProps$collect === void 0 ? void 0 : _previewProps$collect.getIn(['editor', 'visualEditing'], false);
      if (!visualEditing) {
        return;
      }
      try {
        const text = e.target.textContent;
        const decoded = vercelStegaDecode(text);
        if (decoded !== null && decoded !== void 0 && decoded.decap) {
          if (onFieldClick) {
            onFieldClick(decoded.decap);
          }
        }
      } catch (err) {
        console.log('Visual editing error:', err);
      }
    });
  }
  renderPreview() {
    const {
      previewComponent,
      previewProps
    } = this.props;
    return ___EmotionJSX("div", {
      onClick: this.handleClick
    }, isElement(previewComponent) ? /*#__PURE__*/React.cloneElement(previewComponent, previewProps) : /*#__PURE__*/React.createElement(previewComponent, previewProps));
  }
  render() {
    var _previewProps$collect2;
    const {
      previewProps
    } = this.props;
    const visualEditing = previewProps === null || previewProps === void 0 ? void 0 : (_previewProps$collect2 = previewProps.collection) === null || _previewProps$collect2 === void 0 ? void 0 : _previewProps$collect2.getIn(['editor', 'visualEditing'], false);
    const showScrollSync = !visualEditing;
    return ___EmotionJSX(FrameContextConsumer, null, context => {
      const preview = this.renderPreview();
      if (showScrollSync) {
        return ___EmotionJSX(ScrollSyncPane, {
          attachTo: context.document.scrollingElement
        }, preview);
      }
      return preview;
    });
  }
}
PreviewContent.propTypes = {
  previewComponent: PropTypes.func.isRequired,
  previewProps: PropTypes.object,
  onFieldClick: PropTypes.func
};
export default PreviewContent;