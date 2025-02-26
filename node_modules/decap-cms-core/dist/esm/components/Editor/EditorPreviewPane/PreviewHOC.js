const _excluded = ["previewComponent"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
class PreviewHOC extends React.Component {
  /**
   * Only re-render on value change, but always re-render objects and lists.
   * Their child widgets will each also be wrapped with this component, and
   * will only be updated on value change.
   */
  shouldComponentUpdate(nextProps) {
    const isWidgetContainer = ['object', 'list'].includes(nextProps.field.get('widget'));
    return isWidgetContainer || this.props.value !== nextProps.value || this.props.fieldsMetaData !== nextProps.fieldsMetaData || this.props.getAsset !== nextProps.getAsset;
  }
  render() {
    const _this$props = this.props,
      {
        previewComponent
      } = _this$props,
      props = _objectWithoutProperties(_this$props, _excluded);
    return /*#__PURE__*/React.createElement(previewComponent, props);
  }
}
PreviewHOC.propTypes = {
  previewComponent: PropTypes.func.isRequired,
  field: ImmutablePropTypes.map.isRequired,
  value: PropTypes.oneOfType([PropTypes.node, PropTypes.object, PropTypes.string, PropTypes.bool])
};
export default PreviewHOC;