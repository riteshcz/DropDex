const _excluded = ["namespace"],
  _excluded2 = ["children", "isDragging", "connectDragComponent"],
  _excluded3 = ["onDrop", "namespace"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import { HTML5Backend as ReactDNDHTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider as ReactDNDProvider, DragSource as ReactDNDDragSource, DropTarget as ReactDNDDropTarget } from 'react-dnd';
import React from 'react';
import PropTypes from 'prop-types';
import { jsx as ___EmotionJSX } from "@emotion/react";
export function DragSource(_ref) {
  let {
      namespace
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const DragComponent = ReactDNDDragSource(namespace, {
    // eslint-disable-next-line no-unused-vars
    beginDrag(_ref2) {
      let {
          children,
          isDragging,
          connectDragComponent
        } = _ref2,
        ownProps = _objectWithoutProperties(_ref2, _excluded2);
      // We return the rest of the props as the ID of the element being dragged.
      return ownProps;
    }
  }, connect => ({
    connectDragComponent: connect.dragSource()
  }))(({
    children,
    connectDragComponent
  }) => children(connectDragComponent));
  return /*#__PURE__*/React.createElement(DragComponent, props, props.children);
}
DragSource.propTypes = {
  namespace: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired
};
export function DropTarget(_ref3) {
  let {
      onDrop,
      namespace
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  const DropComponent = ReactDNDDropTarget(namespace, {
    drop(ownProps, monitor) {
      onDrop(monitor.getItem());
    }
  }, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isHovered: monitor.isOver()
  }))(({
    children,
    connectDropTarget,
    isHovered
  }) => children(connectDropTarget, {
    isHovered
  }));
  return /*#__PURE__*/React.createElement(DropComponent, props, props.children);
}
DropTarget.propTypes = {
  onDrop: PropTypes.func.isRequired,
  namespace: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired
};
export function HTML5DragDrop(WrappedComponent) {
  return class HTML5DragDrop extends React.Component {
    render() {
      return ___EmotionJSX(ReactDNDProvider, {
        backend: ReactDNDHTML5Backend
      }, ___EmotionJSX(WrappedComponent, this.props));
    }
  };
}