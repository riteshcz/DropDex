import _styled from "@emotion/styled/base";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { lengths } from 'decap-cms-ui-default';
import { connect } from 'react-redux';
import { encodeEntry } from 'decap-cms-lib-util/src/stega';
import { resolveWidget, getPreviewTemplate, getPreviewStyles, getRemarkPlugins } from '../../../lib/registry';
import { getAllEntries, tryLoadEntry } from '../../../actions/entries';
import { ErrorBoundary } from '../../UI';
import { selectTemplateName, selectInferredField, selectField } from '../../../reducers/collections';
import { boundGetAsset } from '../../../actions/media';
import { selectIsLoadingAsset } from '../../../reducers/medias';
import { INFERABLE_FIELDS } from '../../../constants/fieldInference';
import EditorPreviewContent from './EditorPreviewContent.js';
import PreviewHOC from './PreviewHOC';
import EditorPreview from './EditorPreview';
import { jsx as ___EmotionJSX } from "@emotion/react";
const PreviewPaneFrame = /*#__PURE__*/_styled(Frame, {
  target: "enus48h0",
  label: "PreviewPaneFrame"
})("width:100%;height:100%;border:none;background:#fff;border-radius:", lengths.borderRadius, ";" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0VkaXRvci9FZGl0b3JQcmV2aWV3UGFuZS9FZGl0b3JQcmV2aWV3UGFuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE4QnNDIiwiZmlsZSI6Ii4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0VkaXRvci9FZGl0b3JQcmV2aWV3UGFuZS9FZGl0b3JQcmV2aWV3UGFuZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgTGlzdCwgTWFwIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XG5pbXBvcnQgRnJhbWUsIHsgRnJhbWVDb250ZXh0Q29uc3VtZXIgfSBmcm9tICdyZWFjdC1mcmFtZS1jb21wb25lbnQnO1xuaW1wb3J0IHsgbGVuZ3RocyB9IGZyb20gJ2RlY2FwLWNtcy11aS1kZWZhdWx0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBlbmNvZGVFbnRyeSB9IGZyb20gJ2RlY2FwLWNtcy1saWItdXRpbC9zcmMvc3RlZ2EnO1xuXG5pbXBvcnQge1xuICByZXNvbHZlV2lkZ2V0LFxuICBnZXRQcmV2aWV3VGVtcGxhdGUsXG4gIGdldFByZXZpZXdTdHlsZXMsXG4gIGdldFJlbWFya1BsdWdpbnMsXG59IGZyb20gJy4uLy4uLy4uL2xpYi9yZWdpc3RyeSc7XG5pbXBvcnQgeyBnZXRBbGxFbnRyaWVzLCB0cnlMb2FkRW50cnkgfSBmcm9tICcuLi8uLi8uLi9hY3Rpb25zL2VudHJpZXMnO1xuaW1wb3J0IHsgRXJyb3JCb3VuZGFyeSB9IGZyb20gJy4uLy4uL1VJJztcbmltcG9ydCB7XG4gIHNlbGVjdFRlbXBsYXRlTmFtZSxcbiAgc2VsZWN0SW5mZXJyZWRGaWVsZCxcbiAgc2VsZWN0RmllbGQsXG59IGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7IGJvdW5kR2V0QXNzZXQgfSBmcm9tICcuLi8uLi8uLi9hY3Rpb25zL21lZGlhJztcbmltcG9ydCB7IHNlbGVjdElzTG9hZGluZ0Fzc2V0IH0gZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvbWVkaWFzJztcbmltcG9ydCB7IElORkVSQUJMRV9GSUVMRFMgfSBmcm9tICcuLi8uLi8uLi9jb25zdGFudHMvZmllbGRJbmZlcmVuY2UnO1xuaW1wb3J0IEVkaXRvclByZXZpZXdDb250ZW50IGZyb20gJy4vRWRpdG9yUHJldmlld0NvbnRlbnQuanMnO1xuaW1wb3J0IFByZXZpZXdIT0MgZnJvbSAnLi9QcmV2aWV3SE9DJztcbmltcG9ydCBFZGl0b3JQcmV2aWV3IGZyb20gJy4vRWRpdG9yUHJldmlldyc7XG5cbmNvbnN0IFByZXZpZXdQYW5lRnJhbWUgPSBzdHlsZWQoRnJhbWUpYFxuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBib3JkZXI6IG5vbmU7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlci1yYWRpdXM6ICR7bGVuZ3Rocy5ib3JkZXJSYWRpdXN9O1xuYDtcblxuZXhwb3J0IGNsYXNzIFByZXZpZXdQYW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgZ2V0V2lkZ2V0ID0gKGZpZWxkLCB2YWx1ZSwgbWV0YWRhdGEsIHByb3BzLCBpZHggPSBudWxsKSA9PiB7XG4gICAgY29uc3QgeyBnZXRBc3NldCwgZW50cnkgfSA9IHByb3BzO1xuICAgIGNvbnN0IHdpZGdldCA9IHJlc29sdmVXaWRnZXQoZmllbGQuZ2V0KCd3aWRnZXQnKSk7XG4gICAgY29uc3Qga2V5ID0gaWR4ID8gZmllbGQuZ2V0KCduYW1lJykgKyAnXycgKyBpZHggOiBmaWVsZC5nZXQoJ25hbWUnKTtcbiAgICBjb25zdCB2YWx1ZUlzSW5NYXAgPSB2YWx1ZSAmJiAhd2lkZ2V0LmFsbG93TWFwVmFsdWUgJiYgTWFwLmlzTWFwKHZhbHVlKTtcblxuICAgIC8qKlxuICAgICAqIFVzZSBhbiBIT0MgdG8gcHJvdmlkZSBjb25kaXRpb25hbCB1cGRhdGVzIGZvciBhbGwgcHJldmlld3MuXG4gICAgICovXG4gICAgcmV0dXJuICF3aWRnZXQucHJldmlldyA/IG51bGwgOiAoXG4gICAgICA8UHJldmlld0hPQ1xuICAgICAgICBwcmV2aWV3Q29tcG9uZW50PXt3aWRnZXQucHJldmlld31cbiAgICAgICAga2V5PXtrZXl9XG4gICAgICAgIGZpZWxkPXtmaWVsZH1cbiAgICAgICAgZ2V0QXNzZXQ9e2dldEFzc2V0fVxuICAgICAgICB2YWx1ZT17dmFsdWVJc0luTWFwID8gdmFsdWUuZ2V0KGZpZWxkLmdldCgnbmFtZScpKSA6IHZhbHVlfVxuICAgICAgICBlbnRyeT17ZW50cnl9XG4gICAgICAgIGZpZWxkc01ldGFEYXRhPXttZXRhZGF0YX1cbiAgICAgICAgcmVzb2x2ZVdpZGdldD17cmVzb2x2ZVdpZGdldH1cbiAgICAgICAgZ2V0UmVtYXJrUGx1Z2lucz17Z2V0UmVtYXJrUGx1Z2luc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfTtcblxuICBpbmZlcnJlZEZpZWxkcyA9IHt9O1xuXG4gIGluZmVyRmllbGRzKCkge1xuICAgIGNvbnN0IHRpdGxlRmllbGQgPSBzZWxlY3RJbmZlcnJlZEZpZWxkKHRoaXMucHJvcHMuY29sbGVjdGlvbiwgJ3RpdGxlJyk7XG4gICAgY29uc3Qgc2hvcnRUaXRsZUZpZWxkID0gc2VsZWN0SW5mZXJyZWRGaWVsZCh0aGlzLnByb3BzLmNvbGxlY3Rpb24sICdzaG9ydFRpdGxlJyk7XG4gICAgY29uc3QgYXV0aG9yRmllbGQgPSBzZWxlY3RJbmZlcnJlZEZpZWxkKHRoaXMucHJvcHMuY29sbGVjdGlvbiwgJ2F1dGhvcicpO1xuXG4gICAgdGhpcy5pbmZlcnJlZEZpZWxkcyA9IHt9O1xuICAgIGlmICh0aXRsZUZpZWxkKSB0aGlzLmluZmVycmVkRmllbGRzW3RpdGxlRmllbGRdID0gSU5GRVJBQkxFX0ZJRUxEUy50aXRsZTtcbiAgICBpZiAoc2hvcnRUaXRsZUZpZWxkKSB0aGlzLmluZmVycmVkRmllbGRzW3Nob3J0VGl0bGVGaWVsZF0gPSBJTkZFUkFCTEVfRklFTERTLnNob3J0VGl0bGU7XG4gICAgaWYgKGF1dGhvckZpZWxkKSB0aGlzLmluZmVycmVkRmllbGRzW2F1dGhvckZpZWxkXSA9IElORkVSQUJMRV9GSUVMRFMuYXV0aG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZGdldCBjb21wb25lbnQgZm9yIGEgbmFtZWQgZmllbGQsIGFuZCBtYWtlcyByZWN1cnNpdmUgY2FsbHNcbiAgICogdG8gcmV0cmlldmUgY29tcG9uZW50cyBmb3IgbmVzdGVkIGFuZCBkZWVwbHkgbmVzdGVkIGZpZWxkcywgd2hpY2ggb2NjdXIgaW5cbiAgICogb2JqZWN0IGFuZCBsaXN0IHR5cGUgZmllbGRzLiBVc2VkIGludGVybmFsbHkgdG8gcmV0cmlldmUgd2lkZ2V0cywgYW5kIGFsc29cbiAgICogZXhwb3NlZCBmb3IgdXNlIGluIGN1c3RvbSBwcmV2aWV3IHRlbXBsYXRlcy5cbiAgICovXG4gIHdpZGdldEZvciA9IChcbiAgICBuYW1lLFxuICAgIGZpZWxkcyA9IHRoaXMucHJvcHMuZmllbGRzLFxuICAgIHZhbHVlcyA9IHRoaXMucHJvcHMuZW50cnkuZ2V0KCdkYXRhJyksXG4gICAgZmllbGRzTWV0YURhdGEgPSB0aGlzLnByb3BzLmZpZWxkc01ldGFEYXRhLFxuICApID0+IHtcbiAgICAvLyBXZSByZXRyaWV2ZSB0aGUgZmllbGQgYnkgbmFtZSBzbyB0aGF0IHRoaXMgZnVuY3Rpb24gY2FuIGFsc28gYmUgdXNlZCBpblxuICAgIC8vIGN1c3RvbSBwcmV2aWV3IHRlbXBsYXRlcywgd2hlcmUgdGhlIGZpZWxkIG9iamVjdCBjYW4ndCBiZSBwYXNzZWQgaW4uXG4gICAgbGV0IGZpZWxkID0gZmllbGRzICYmIGZpZWxkcy5maW5kKGYgPT4gZi5nZXQoJ25hbWUnKSA9PT0gbmFtZSk7XG4gICAgbGV0IHZhbHVlID0gTWFwLmlzTWFwKHZhbHVlcykgJiYgdmFsdWVzLmdldChmaWVsZC5nZXQoJ25hbWUnKSk7XG4gICAgaWYgKGZpZWxkLmdldCgnbWV0YScpKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMucHJvcHMuZW50cnkuZ2V0SW4oWydtZXRhJywgZmllbGQuZ2V0KCduYW1lJyldKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXN0ZWRGaWVsZHMgPSBmaWVsZC5nZXQoJ2ZpZWxkcycpO1xuICAgIGNvbnN0IHNpbmdsZUZpZWxkID0gZmllbGQuZ2V0KCdmaWVsZCcpO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gZmllbGRzTWV0YURhdGEgJiYgZmllbGRzTWV0YURhdGEuZ2V0KGZpZWxkLmdldCgnbmFtZScpLCBNYXAoKSk7XG5cbiAgICBpZiAobmVzdGVkRmllbGRzKSB7XG4gICAgICBmaWVsZCA9IGZpZWxkLnNldCgnZmllbGRzJywgdGhpcy5nZXROZXN0ZWRXaWRnZXRzKG5lc3RlZEZpZWxkcywgdmFsdWUsIG1ldGFkYXRhKSk7XG4gICAgfVxuXG4gICAgaWYgKHNpbmdsZUZpZWxkKSB7XG4gICAgICBmaWVsZCA9IGZpZWxkLnNldCgnZmllbGQnLCB0aGlzLmdldFNpbmdsZU5lc3RlZChzaW5nbGVGaWVsZCwgdmFsdWUsIG1ldGFkYXRhKSk7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxsZWRXaWRnZXRzID0gWydzdHJpbmcnLCAndGV4dCcsICdudW1iZXInXTtcbiAgICBjb25zdCBpbmZlcnJlZEZpZWxkID0gT2JqZWN0LmVudHJpZXModGhpcy5pbmZlcnJlZEZpZWxkcylcbiAgICAgIC5maWx0ZXIoKFtrZXldKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpZWxkVG9NYXRjaCA9IHNlbGVjdEZpZWxkKHRoaXMucHJvcHMuY29sbGVjdGlvbiwga2V5KTtcbiAgICAgICAgcmV0dXJuIGZpZWxkVG9NYXRjaCA9PT0gZmllbGQ7XG4gICAgICB9KVxuICAgICAgLm1hcCgoWywgdmFsdWVdKSA9PiB2YWx1ZSlbMF07XG5cbiAgICBpZiAoaW5mZXJyZWRGaWVsZCkge1xuICAgICAgdmFsdWUgPSBpbmZlcnJlZEZpZWxkLmRlZmF1bHRQcmV2aWV3KHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdmFsdWUgJiZcbiAgICAgIGxhYmVsbGVkV2lkZ2V0cy5pbmRleE9mKGZpZWxkLmdldCgnd2lkZ2V0JykpICE9PSAtMSAmJlxuICAgICAgdmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPCA1MFxuICAgICkge1xuICAgICAgdmFsdWUgPSAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHN0cm9uZz57ZmllbGQuZ2V0KCdsYWJlbCcsIGZpZWxkLmdldCgnbmFtZScpKX06PC9zdHJvbmc+IHt2YWx1ZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZSA/IHRoaXMuZ2V0V2lkZ2V0KGZpZWxkLCB2YWx1ZSwgbWV0YWRhdGEsIHRoaXMucHJvcHMpIDogbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogUmV0cmlldmVzIHdpZGdldHMgZm9yIG5lc3RlZCBmaWVsZHMgKGNoaWxkcmVuIG9mIG9iamVjdC9saXN0IGZpZWxkcylcbiAgICovXG4gIGdldE5lc3RlZFdpZGdldHMgPSAoZmllbGRzLCB2YWx1ZXMsIGZpZWxkc01ldGFEYXRhKSA9PiB7XG4gICAgLy8gRmllbGRzIG5lc3RlZCB3aXRoaW4gYSBsaXN0IGZpZWxkIHdpbGwgYmUgcGFpcmVkIHdpdGggYSBMaXN0IG9mIHZhbHVlIE1hcHMuXG4gICAgaWYgKExpc3QuaXNMaXN0KHZhbHVlcykpIHtcbiAgICAgIHJldHVybiB2YWx1ZXMubWFwKHZhbHVlID0+IHRoaXMud2lkZ2V0c0Zvck5lc3RlZEZpZWxkcyhmaWVsZHMsIHZhbHVlLCBmaWVsZHNNZXRhRGF0YSkpO1xuICAgIH1cbiAgICAvLyBGaWVsZHMgbmVzdGVkIHdpdGhpbiBhbiBvYmplY3QgZmllbGQgd2lsbCBiZSBwYWlyZWQgd2l0aCBhIHNpbmdsZSBNYXAgb2YgdmFsdWVzLlxuICAgIHJldHVybiB0aGlzLndpZGdldHNGb3JOZXN0ZWRGaWVsZHMoZmllbGRzLCB2YWx1ZXMsIGZpZWxkc01ldGFEYXRhKTtcbiAgfTtcblxuICBnZXRTaW5nbGVOZXN0ZWQgPSAoZmllbGQsIHZhbHVlcywgZmllbGRzTWV0YURhdGEpID0+IHtcbiAgICBpZiAoTGlzdC5pc0xpc3QodmFsdWVzKSkge1xuICAgICAgcmV0dXJuIHZhbHVlcy5tYXAoKHZhbHVlLCBpZHgpID0+XG4gICAgICAgIHRoaXMuZ2V0V2lkZ2V0KGZpZWxkLCB2YWx1ZSwgZmllbGRzTWV0YURhdGEuZ2V0KGZpZWxkLmdldCgnbmFtZScpKSwgdGhpcy5wcm9wcywgaWR4KSxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldFdpZGdldChmaWVsZCwgdmFsdWVzLCBmaWVsZHNNZXRhRGF0YS5nZXQoZmllbGQuZ2V0KCduYW1lJykpLCB0aGlzLnByb3BzKTtcbiAgfTtcblxuICAvKipcbiAgICogVXNlIHdpZGdldEZvciBhcyBhIG1hcHBpbmcgZnVuY3Rpb24gZm9yIHJlY3Vyc2l2ZSB3aWRnZXQgcmV0cmlldmFsXG4gICAqL1xuICB3aWRnZXRzRm9yTmVzdGVkRmllbGRzID0gKGZpZWxkcywgdmFsdWVzLCBmaWVsZHNNZXRhRGF0YSkgPT4ge1xuICAgIHJldHVybiBmaWVsZHMubWFwKGZpZWxkID0+IHRoaXMud2lkZ2V0Rm9yKGZpZWxkLmdldCgnbmFtZScpLCBmaWVsZHMsIHZhbHVlcywgZmllbGRzTWV0YURhdGEpKTtcbiAgfTtcblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBleGlzdHMgZW50aXJlbHkgdG8gZXhwb3NlIG5lc3RlZCB3aWRnZXRzIGZvciBvYmplY3QgYW5kIGxpc3RcbiAgICogZmllbGRzIHRvIGN1c3RvbSBwcmV2aWV3IHRlbXBsYXRlcy5cbiAgICpcbiAgICogVE9ETzogc2VlIGlmIHdpZGdldEZvciBjYW4gbm93IHByb3ZpZGUgdGhpcyBmdW5jdGlvbmFsaXR5IGZvciBwcmV2aWV3IHRlbXBsYXRlc1xuICAgKi9cbiAgd2lkZ2V0c0ZvciA9IG5hbWUgPT4ge1xuICAgIGNvbnN0IHsgZmllbGRzLCBlbnRyeSwgZmllbGRzTWV0YURhdGEgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZmllbGQgPSBmaWVsZHMuZmluZChmID0+IGYuZ2V0KCduYW1lJykgPT09IG5hbWUpO1xuICAgIGNvbnN0IG5lc3RlZEZpZWxkcyA9IGZpZWxkICYmIGZpZWxkLmdldCgnZmllbGRzJyk7XG4gICAgY29uc3QgdmFyaWFibGVUeXBlcyA9IGZpZWxkICYmIGZpZWxkLmdldCgndHlwZXMnKTtcbiAgICBjb25zdCB2YWx1ZSA9IGVudHJ5LmdldEluKFsnZGF0YScsIGZpZWxkLmdldCgnbmFtZScpXSk7XG4gICAgY29uc3QgbWV0YWRhdGEgPSBmaWVsZHNNZXRhRGF0YS5nZXQoZmllbGQuZ2V0KCduYW1lJyksIE1hcCgpKTtcblxuICAgIC8vIFZhcmlhYmxlIFR5cGUgbGlzdHNcbiAgICBpZiAoTGlzdC5pc0xpc3QodmFsdWUpICYmIHZhcmlhYmxlVHlwZXMpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5tYXAodmFsID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWVUeXBlID0gdmFyaWFibGVUeXBlcy5maW5kKHQgPT4gdC5nZXQoJ25hbWUnKSA9PT0gdmFsLmdldCgndHlwZScpKTtcbiAgICAgICAgY29uc3QgdHlwZUZpZWxkcyA9IHZhbHVlVHlwZSAmJiB2YWx1ZVR5cGUuZ2V0KCdmaWVsZHMnKTtcbiAgICAgICAgY29uc3Qgd2lkZ2V0cyA9XG4gICAgICAgICAgdHlwZUZpZWxkcyAmJlxuICAgICAgICAgIE1hcChcbiAgICAgICAgICAgIHR5cGVGaWVsZHMubWFwKChmLCBpKSA9PiBbXG4gICAgICAgICAgICAgIGYuZ2V0KCduYW1lJyksXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtpfT57dGhpcy5nZXRXaWRnZXQoZiwgdmFsLCBtZXRhZGF0YS5nZXQoZi5nZXQoJ25hbWUnKSksIHRoaXMucHJvcHMpfTwvZGl2PixcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICk7XG4gICAgICAgIHJldHVybiBNYXAoeyBkYXRhOiB2YWwsIHdpZGdldHMgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBMaXN0IHdpZGdldHNcbiAgICBpZiAoTGlzdC5pc0xpc3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUubWFwKHZhbCA9PiB7XG4gICAgICAgIGNvbnN0IHdpZGdldHMgPVxuICAgICAgICAgIG5lc3RlZEZpZWxkcyAmJlxuICAgICAgICAgIE1hcChcbiAgICAgICAgICAgIG5lc3RlZEZpZWxkcy5tYXAoKGYsIGkpID0+IFtcbiAgICAgICAgICAgICAgZi5nZXQoJ25hbWUnKSxcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9Pnt0aGlzLmdldFdpZGdldChmLCB2YWwsIG1ldGFkYXRhLmdldChmLmdldCgnbmFtZScpKSwgdGhpcy5wcm9wcyl9PC9kaXY+LFxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIE1hcCh7IGRhdGE6IHZhbCwgd2lkZ2V0cyB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBNYXAoe1xuICAgICAgZGF0YTogdmFsdWUsXG4gICAgICB3aWRnZXRzOlxuICAgICAgICBuZXN0ZWRGaWVsZHMgJiZcbiAgICAgICAgTWFwKFxuICAgICAgICAgIG5lc3RlZEZpZWxkcy5tYXAoZiA9PiBbXG4gICAgICAgICAgICBmLmdldCgnbmFtZScpLFxuICAgICAgICAgICAgdGhpcy5nZXRXaWRnZXQoZiwgdmFsdWUsIG1ldGFkYXRhLmdldChmLmdldCgnbmFtZScpKSwgdGhpcy5wcm9wcyksXG4gICAgICAgICAgXSksXG4gICAgICAgICksXG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gZXhpc3RzIGVudGlyZWx5IHRvIGV4cG9zZSBjb2xsZWN0aW9ucyBmcm9tIG91dHNpZGUgb2YgdGhpcyBlbnRyeVxuICAgKlxuICAgKi9cbiAgZ2V0Q29sbGVjdGlvbiA9IGFzeW5jIChjb2xsZWN0aW9uTmFtZSwgc2x1ZykgPT4ge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc2VsZWN0ZWRDb2xsZWN0aW9uID0gc3RhdGUuY29sbGVjdGlvbnMuZ2V0KGNvbGxlY3Rpb25OYW1lKTtcblxuICAgIGlmICh0eXBlb2Ygc2x1ZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IGVudHJpZXMgPSBhd2FpdCBnZXRBbGxFbnRyaWVzKHN0YXRlLCBzZWxlY3RlZENvbGxlY3Rpb24pO1xuICAgICAgcmV0dXJuIGVudHJpZXMubWFwKGVudHJ5ID0+IE1hcCgpLnNldCgnZGF0YScsIGVudHJ5LmRhdGEpKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbnRyeSA9IGF3YWl0IHRyeUxvYWRFbnRyeShzdGF0ZSwgc2VsZWN0ZWRDb2xsZWN0aW9uLCBzbHVnKTtcbiAgICByZXR1cm4gTWFwKCkuc2V0KCdkYXRhJywgZW50cnkuZGF0YSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZW50cnksIGNvbGxlY3Rpb24sIGNvbmZpZyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghZW50cnkgfHwgIWVudHJ5LmdldCgnZGF0YScpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aWV3Q29tcG9uZW50ID1cbiAgICAgIGdldFByZXZpZXdUZW1wbGF0ZShzZWxlY3RUZW1wbGF0ZU5hbWUoY29sbGVjdGlvbiwgZW50cnkuZ2V0KCdzbHVnJykpKSB8fCBFZGl0b3JQcmV2aWV3O1xuXG4gICAgdGhpcy5pbmZlckZpZWxkcygpO1xuXG4gICAgY29uc3QgdmlzdWFsRWRpdGluZyA9IGNvbGxlY3Rpb24uZ2V0SW4oWydlZGl0b3InLCAndmlzdWFsRWRpdGluZyddLCBmYWxzZSk7XG5cbiAgICAvLyBPbmx5IGVuY29kZSBlbnRyeSBkYXRhIGlmIHZpc3VhbCBlZGl0aW5nIGlzIGVuYWJsZWRcbiAgICBjb25zdCBwcmV2aWV3RW50cnkgPSB2aXN1YWxFZGl0aW5nXG4gICAgICA/IGVudHJ5LnNldCgnZGF0YScsIGVuY29kZUVudHJ5KGVudHJ5LmdldCgnZGF0YScpLCB0aGlzLnByb3BzLmZpZWxkcykpXG4gICAgICA6IGVudHJ5O1xuXG4gICAgY29uc3QgcHJldmlld1Byb3BzID0ge1xuICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgIGVudHJ5OiBwcmV2aWV3RW50cnksXG4gICAgICB3aWRnZXRGb3I6IChuYW1lLCBmaWVsZHMsIHZhbHVlcyA9IHByZXZpZXdFbnRyeS5nZXQoJ2RhdGEnKSwgZmllbGRzTWV0YURhdGEpID0+XG4gICAgICAgIHRoaXMud2lkZ2V0Rm9yKG5hbWUsIGZpZWxkcywgdmFsdWVzLCBmaWVsZHNNZXRhRGF0YSksXG4gICAgICB3aWRnZXRzRm9yOiB0aGlzLndpZGdldHNGb3IsXG4gICAgICBnZXRDb2xsZWN0aW9uOiB0aGlzLmdldENvbGxlY3Rpb24sXG4gICAgfTtcblxuICAgIGNvbnN0IHN0eWxlRWxzID0gZ2V0UHJldmlld1N0eWxlcygpLm1hcCgoc3R5bGUsIGkpID0+IHtcbiAgICAgIGlmIChzdHlsZS5yYXcpIHtcbiAgICAgICAgcmV0dXJuIDxzdHlsZSBrZXk9e2l9PntzdHlsZS52YWx1ZX08L3N0eWxlPjtcbiAgICAgIH1cbiAgICAgIHJldHVybiA8bGluayBrZXk9e2l9IGhyZWY9e3N0eWxlLnZhbHVlfSB0eXBlPVwidGV4dC9jc3NcIiByZWw9XCJzdHlsZXNoZWV0XCIgLz47XG4gICAgfSk7XG5cbiAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgIDxQcmV2aWV3UGFuZUZyYW1lIGlkPVwicHJldmlldy1wYW5lXCIgaGVhZD17c3R5bGVFbHN9IC8+O1xuICAgIH1cblxuICAgIGNvbnN0IGluaXRpYWxDb250ZW50ID0gYFxuPCFET0NUWVBFIGh0bWw+XG48aHRtbD5cbiAgPGhlYWQ+PGJhc2UgdGFyZ2V0PVwiX2JsYW5rXCIvPjwvaGVhZD5cbiAgPGJvZHk+PGRpdj48L2Rpdj48L2JvZHk+XG48L2h0bWw+XG5gO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxFcnJvckJvdW5kYXJ5IGNvbmZpZz17Y29uZmlnfT5cbiAgICAgICAgPFByZXZpZXdQYW5lRnJhbWUgaWQ9XCJwcmV2aWV3LXBhbmVcIiBoZWFkPXtzdHlsZUVsc30gaW5pdGlhbENvbnRlbnQ9e2luaXRpYWxDb250ZW50fT5cbiAgICAgICAgICA8RnJhbWVDb250ZXh0Q29uc3VtZXI+XG4gICAgICAgICAgICB7KHsgZG9jdW1lbnQsIHdpbmRvdyB9KSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEVkaXRvclByZXZpZXdDb250ZW50XG4gICAgICAgICAgICAgICAgICB7Li4ueyBwcmV2aWV3Q29tcG9uZW50LCBwcmV2aWV3UHJvcHM6IHsgLi4ucHJldmlld1Byb3BzLCBkb2N1bWVudCwgd2luZG93IH0gfX1cbiAgICAgICAgICAgICAgICAgIG9uRmllbGRDbGljaz17dGhpcy5wcm9wcy5vbkZpZWxkQ2xpY2t9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPC9GcmFtZUNvbnRleHRDb25zdW1lcj5cbiAgICAgICAgPC9QcmV2aWV3UGFuZUZyYW1lPlxuICAgICAgPC9FcnJvckJvdW5kYXJ5PlxuICAgICk7XG4gIH1cbn1cblxuUHJldmlld1BhbmUucHJvcFR5cGVzID0ge1xuICBjb2xsZWN0aW9uOiBJbW11dGFibGVQcm9wVHlwZXMubWFwLmlzUmVxdWlyZWQsXG4gIGZpZWxkczogSW1tdXRhYmxlUHJvcFR5cGVzLmxpc3QuaXNSZXF1aXJlZCxcbiAgZW50cnk6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcbiAgZmllbGRzTWV0YURhdGE6IEltbXV0YWJsZVByb3BUeXBlcy5tYXAuaXNSZXF1aXJlZCxcbiAgZ2V0QXNzZXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uRmllbGRDbGljazogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcbiAgY29uc3QgaXNMb2FkaW5nQXNzZXQgPSBzZWxlY3RJc0xvYWRpbmdBc3NldChzdGF0ZS5tZWRpYXMpO1xuICByZXR1cm4geyBpc0xvYWRpbmdBc3NldCwgY29uZmlnOiBzdGF0ZS5jb25maWcsIHN0YXRlIH07XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuICByZXR1cm4ge1xuICAgIGJvdW5kR2V0QXNzZXQ6IChjb2xsZWN0aW9uLCBlbnRyeSkgPT4gYm91bmRHZXRBc3NldChkaXNwYXRjaCwgY29sbGVjdGlvbiwgZW50cnkpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBtZXJnZVByb3BzKHN0YXRlUHJvcHMsIGRpc3BhdGNoUHJvcHMsIG93blByb3BzKSB7XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGVQcm9wcyxcbiAgICAuLi5kaXNwYXRjaFByb3BzLFxuICAgIC4uLm93blByb3BzLFxuICAgIGdldEFzc2V0OiBkaXNwYXRjaFByb3BzLmJvdW5kR2V0QXNzZXQob3duUHJvcHMuY29sbGVjdGlvbiwgb3duUHJvcHMuZW50cnkpLFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzLCBtZXJnZVByb3BzKShQcmV2aWV3UGFuZSk7XG4iXX0= */"));
export class PreviewPane extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "getWidget", (field, value, metadata, props, idx = null) => {
      const {
        getAsset,
        entry
      } = props;
      const widget = resolveWidget(field.get('widget'));
      const key = idx ? field.get('name') + '_' + idx : field.get('name');
      const valueIsInMap = value && !widget.allowMapValue && Map.isMap(value);

      /**
       * Use an HOC to provide conditional updates for all previews.
       */
      return !widget.preview ? null : ___EmotionJSX(PreviewHOC, {
        previewComponent: widget.preview,
        key: key,
        field: field,
        getAsset: getAsset,
        value: valueIsInMap ? value.get(field.get('name')) : value,
        entry: entry,
        fieldsMetaData: metadata,
        resolveWidget: resolveWidget,
        getRemarkPlugins: getRemarkPlugins
      });
    });
    _defineProperty(this, "inferredFields", {});
    /**
     * Returns the widget component for a named field, and makes recursive calls
     * to retrieve components for nested and deeply nested fields, which occur in
     * object and list type fields. Used internally to retrieve widgets, and also
     * exposed for use in custom preview templates.
     */
    _defineProperty(this, "widgetFor", (name, fields = this.props.fields, values = this.props.entry.get('data'), fieldsMetaData = this.props.fieldsMetaData) => {
      // We retrieve the field by name so that this function can also be used in
      // custom preview templates, where the field object can't be passed in.
      let field = fields && fields.find(f => f.get('name') === name);
      let value = Map.isMap(values) && values.get(field.get('name'));
      if (field.get('meta')) {
        value = this.props.entry.getIn(['meta', field.get('name')]);
      }
      const nestedFields = field.get('fields');
      const singleField = field.get('field');
      const metadata = fieldsMetaData && fieldsMetaData.get(field.get('name'), Map());
      if (nestedFields) {
        field = field.set('fields', this.getNestedWidgets(nestedFields, value, metadata));
      }
      if (singleField) {
        field = field.set('field', this.getSingleNested(singleField, value, metadata));
      }
      const labelledWidgets = ['string', 'text', 'number'];
      const inferredField = Object.entries(this.inferredFields).filter(([key]) => {
        const fieldToMatch = selectField(this.props.collection, key);
        return fieldToMatch === field;
      }).map(([, value]) => value)[0];
      if (inferredField) {
        value = inferredField.defaultPreview(value);
      } else if (value && labelledWidgets.indexOf(field.get('widget')) !== -1 && value.toString().length < 50) {
        value = ___EmotionJSX("div", null, ___EmotionJSX("strong", null, field.get('label', field.get('name')), ":"), " ", value);
      }
      return value ? this.getWidget(field, value, metadata, this.props) : null;
    });
    /**
     * Retrieves widgets for nested fields (children of object/list fields)
     */
    _defineProperty(this, "getNestedWidgets", (fields, values, fieldsMetaData) => {
      // Fields nested within a list field will be paired with a List of value Maps.
      if (List.isList(values)) {
        return values.map(value => this.widgetsForNestedFields(fields, value, fieldsMetaData));
      }
      // Fields nested within an object field will be paired with a single Map of values.
      return this.widgetsForNestedFields(fields, values, fieldsMetaData);
    });
    _defineProperty(this, "getSingleNested", (field, values, fieldsMetaData) => {
      if (List.isList(values)) {
        return values.map((value, idx) => this.getWidget(field, value, fieldsMetaData.get(field.get('name')), this.props, idx));
      }
      return this.getWidget(field, values, fieldsMetaData.get(field.get('name')), this.props);
    });
    /**
     * Use widgetFor as a mapping function for recursive widget retrieval
     */
    _defineProperty(this, "widgetsForNestedFields", (fields, values, fieldsMetaData) => {
      return fields.map(field => this.widgetFor(field.get('name'), fields, values, fieldsMetaData));
    });
    /**
     * This function exists entirely to expose nested widgets for object and list
     * fields to custom preview templates.
     *
     * TODO: see if widgetFor can now provide this functionality for preview templates
     */
    _defineProperty(this, "widgetsFor", name => {
      const {
        fields,
        entry,
        fieldsMetaData
      } = this.props;
      const field = fields.find(f => f.get('name') === name);
      const nestedFields = field && field.get('fields');
      const variableTypes = field && field.get('types');
      const value = entry.getIn(['data', field.get('name')]);
      const metadata = fieldsMetaData.get(field.get('name'), Map());

      // Variable Type lists
      if (List.isList(value) && variableTypes) {
        return value.map(val => {
          const valueType = variableTypes.find(t => t.get('name') === val.get('type'));
          const typeFields = valueType && valueType.get('fields');
          const widgets = typeFields && Map(typeFields.map((f, i) => [f.get('name'), ___EmotionJSX("div", {
            key: i
          }, this.getWidget(f, val, metadata.get(f.get('name')), this.props))]));
          return Map({
            data: val,
            widgets
          });
        });
      }

      // List widgets
      if (List.isList(value)) {
        return value.map(val => {
          const widgets = nestedFields && Map(nestedFields.map((f, i) => [f.get('name'), ___EmotionJSX("div", {
            key: i
          }, this.getWidget(f, val, metadata.get(f.get('name')), this.props))]));
          return Map({
            data: val,
            widgets
          });
        });
      }
      return Map({
        data: value,
        widgets: nestedFields && Map(nestedFields.map(f => [f.get('name'), this.getWidget(f, value, metadata.get(f.get('name')), this.props)]))
      });
    });
    /**
     * This function exists entirely to expose collections from outside of this entry
     *
     */
    _defineProperty(this, "getCollection", async (collectionName, slug) => {
      const {
        state
      } = this.props;
      const selectedCollection = state.collections.get(collectionName);
      if (typeof slug === 'undefined') {
        const entries = await getAllEntries(state, selectedCollection);
        return entries.map(entry => Map().set('data', entry.data));
      }
      const entry = await tryLoadEntry(state, selectedCollection, slug);
      return Map().set('data', entry.data);
    });
  }
  inferFields() {
    const titleField = selectInferredField(this.props.collection, 'title');
    const shortTitleField = selectInferredField(this.props.collection, 'shortTitle');
    const authorField = selectInferredField(this.props.collection, 'author');
    this.inferredFields = {};
    if (titleField) this.inferredFields[titleField] = INFERABLE_FIELDS.title;
    if (shortTitleField) this.inferredFields[shortTitleField] = INFERABLE_FIELDS.shortTitle;
    if (authorField) this.inferredFields[authorField] = INFERABLE_FIELDS.author;
  }
  render() {
    const {
      entry,
      collection,
      config
    } = this.props;
    if (!entry || !entry.get('data')) {
      return null;
    }
    const previewComponent = getPreviewTemplate(selectTemplateName(collection, entry.get('slug'))) || EditorPreview;
    this.inferFields();
    const visualEditing = collection.getIn(['editor', 'visualEditing'], false);

    // Only encode entry data if visual editing is enabled
    const previewEntry = visualEditing ? entry.set('data', encodeEntry(entry.get('data'), this.props.fields)) : entry;
    const previewProps = _objectSpread(_objectSpread({}, this.props), {}, {
      entry: previewEntry,
      widgetFor: (name, fields, values = previewEntry.get('data'), fieldsMetaData) => this.widgetFor(name, fields, values, fieldsMetaData),
      widgetsFor: this.widgetsFor,
      getCollection: this.getCollection
    });
    const styleEls = getPreviewStyles().map((style, i) => {
      if (style.raw) {
        return ___EmotionJSX("style", {
          key: i
        }, style.value);
      }
      return ___EmotionJSX("link", {
        key: i,
        href: style.value,
        type: "text/css",
        rel: "stylesheet"
      });
    });
    if (!collection) {
      ___EmotionJSX(PreviewPaneFrame, {
        id: "preview-pane",
        head: styleEls
      });
    }
    const initialContent = `
<!DOCTYPE html>
<html>
  <head><base target="_blank"/></head>
  <body><div></div></body>
</html>
`;
    return ___EmotionJSX(ErrorBoundary, {
      config: config
    }, ___EmotionJSX(PreviewPaneFrame, {
      id: "preview-pane",
      head: styleEls,
      initialContent: initialContent
    }, ___EmotionJSX(FrameContextConsumer, null, ({
      document,
      window
    }) => {
      return ___EmotionJSX(EditorPreviewContent, {
        previewComponent,
        previewProps: _objectSpread(_objectSpread({}, previewProps), {}, {
          document,
          window
        }),
        onFieldClick: this.props.onFieldClick
      });
    })));
  }
}
PreviewPane.propTypes = {
  collection: ImmutablePropTypes.map.isRequired,
  fields: ImmutablePropTypes.list.isRequired,
  entry: ImmutablePropTypes.map.isRequired,
  fieldsMetaData: ImmutablePropTypes.map.isRequired,
  getAsset: PropTypes.func.isRequired,
  onFieldClick: PropTypes.func
};
function mapStateToProps(state) {
  const isLoadingAsset = selectIsLoadingAsset(state.medias);
  return {
    isLoadingAsset,
    config: state.config,
    state
  };
}
function mapDispatchToProps(dispatch) {
  return {
    boundGetAsset: (collection, entry) => boundGetAsset(dispatch, collection, entry)
  };
}
function mergeProps(stateProps, dispatchProps, ownProps) {
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, stateProps), dispatchProps), ownProps), {}, {
    getAsset: dispatchProps.boundGetAsset(ownProps.collection, ownProps.entry)
  });
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PreviewPane);