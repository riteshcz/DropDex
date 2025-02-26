function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map, List } from 'immutable';
import { oneLine } from 'common-tags';
import { getRemarkPlugins } from '../../../lib/registry';
import ValidationErrorTypes from '../../../constants/validationErrorTypes';
function truthy() {
  return {
    error: false
  };
}
function isEmpty(value) {
  return value === null || value === undefined || Object.prototype.hasOwnProperty.call(value, 'length') && value.length === 0 || value.constructor === Object && Object.keys(value).length === 0 || List.isList(value) && value.size === 0;
}
export default class Widget extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "processInnerControlRef", ref => {
      if (!ref) return;

      /**
       * If the widget is a container that receives state updates from the store,
       * we'll need to get the ref of the actual control via the `react-redux`
       * `getWrappedInstance` method. Note that connected widgets must pass
       * `withRef: true` to `connect` in the options object.
       */
      this.innerWrappedControl = ref.getWrappedInstance ? ref.getWrappedInstance() : ref;
      this.wrappedControlValid = this.innerWrappedControl.isValid || truthy;

      /**
       * Get the `shouldComponentUpdate` method from the wrapped control, and
       * provide the control instance is the `this` binding.
       */
      const {
        shouldComponentUpdate: scu
      } = this.innerWrappedControl;
      this.wrappedControlShouldComponentUpdate = scu && scu.bind(this.innerWrappedControl);

      // Call the control ref if provided, passing this Widget instance
      if (this.props.controlRef) {
        this.props.controlRef(this);
      }
    });
    _defineProperty(this, "getValidateValue", () => {
      var _this$innerWrappedCon, _this$innerWrappedCon2;
      let value = ((_this$innerWrappedCon = this.innerWrappedControl) === null || _this$innerWrappedCon === void 0 ? void 0 : (_this$innerWrappedCon2 = _this$innerWrappedCon.getValidateValue) === null || _this$innerWrappedCon2 === void 0 ? void 0 : _this$innerWrappedCon2.call(_this$innerWrappedCon)) || this.props.value;
      // Convert list input widget value to string for validation test
      List.isList(value) && (value = value.join(','));
      return value;
    });
    _defineProperty(this, "validate", (skipWrapped = false) => {
      const value = this.getValidateValue();
      const field = this.props.field;
      const errors = [];
      const validations = [this.validatePresence, this.validatePattern];
      if (field.get('meta')) {
        validations.push(this.props.validateMetaField);
      }
      validations.forEach(func => {
        const response = func(field, value, this.props.t);
        if (response.error) errors.push(response.error);
      });
      if (skipWrapped) {
        if (skipWrapped.error) errors.push(skipWrapped.error);
      } else {
        const wrappedError = this.validateWrappedControl(field);
        if (wrappedError.error) errors.push(wrappedError.error);
      }
      this.props.onValidate(errors);
    });
    _defineProperty(this, "validatePresence", (field, value) => {
      const {
        t,
        parentIds
      } = this.props;
      const isRequired = field.get('required', true);
      if (isRequired && isEmpty(value)) {
        const error = {
          type: ValidationErrorTypes.PRESENCE,
          parentIds,
          message: t('editor.editorControlPane.widget.required', {
            fieldLabel: field.get('label', field.get('name'))
          })
        };
        return {
          error
        };
      }
      return {
        error: false
      };
    });
    _defineProperty(this, "validatePattern", (field, value) => {
      const {
        t,
        parentIds
      } = this.props;
      const pattern = field.get('pattern', false);
      if (isEmpty(value)) {
        return {
          error: false
        };
      }
      if (pattern && !RegExp(pattern.first()).test(value)) {
        const error = {
          type: ValidationErrorTypes.PATTERN,
          parentIds,
          message: t('editor.editorControlPane.widget.regexPattern', {
            fieldLabel: field.get('label', field.get('name')),
            pattern: pattern.last()
          })
        };
        return {
          error
        };
      }
      return {
        error: false
      };
    });
    _defineProperty(this, "validateWrappedControl", field => {
      const {
        t,
        parentIds
      } = this.props;
      if (typeof this.wrappedControlValid !== 'function') {
        throw new Error(oneLine`
        this.wrappedControlValid is not a function. Are you sure widget
        "${field.get('widget')}" is registered?
      `);
      }
      const response = this.wrappedControlValid();
      if (typeof response === 'boolean') {
        const isValid = response;
        return {
          error: !isValid
        };
      } else if (Object.prototype.hasOwnProperty.call(response, 'error')) {
        return response;
      } else if (response instanceof Promise) {
        response.then(() => {
          this.validate({
            error: false
          });
        }, err => {
          const error = {
            type: ValidationErrorTypes.CUSTOM,
            message: `${field.get('label', field.get('name'))} - ${err}.`
          };
          this.validate({
            error
          });
        });
        const error = {
          type: ValidationErrorTypes.CUSTOM,
          parentIds,
          message: t('editor.editorControlPane.widget.processing', {
            fieldLabel: field.get('label', field.get('name'))
          })
        };
        return {
          error
        };
      }
      return {
        error: false
      };
    });
    /**
     * In case the `onChangeObject` function is frozen by a child widget implementation,
     * e.g. when debounced, always get the latest object value instead of using
     * `this.props.value` directly.
     */
    _defineProperty(this, "getObjectValue", () => this.props.value || Map());
    /**
     * Change handler for fields that are nested within another field.
     */
    _defineProperty(this, "onChangeObject", (field, newValue, newMetadata) => {
      const newObjectValue = this.getObjectValue().set(field.get('name'), newValue);
      return this.props.onChange(newObjectValue, newMetadata && {
        [this.props.field.get('name')]: newMetadata
      });
    });
    _defineProperty(this, "setInactiveStyle", () => {
      this.props.setInactiveStyle();
      if (this.props.field.has('pattern') && !isEmpty(this.getValidateValue())) {
        this.validate();
      }
    });
  }
  shouldComponentUpdate(nextProps) {
    /**
     * Avoid unnecessary rerenders while loading assets.
     */
    if (this.props.isLoadingAsset && nextProps.isLoadingAsset) return false;
    /**
     * Allow widgets to provide their own `shouldComponentUpdate` method.
     */
    if (this.wrappedControlShouldComponentUpdate) {
      return this.wrappedControlShouldComponentUpdate(nextProps);
    }
    return this.props.value !== nextProps.value || this.props.classNameWrapper !== nextProps.classNameWrapper || this.props.hasActiveStyle !== nextProps.hasActiveStyle;
  }
  focus(path) {
    var _this$innerWrappedCon3;
    // Try widget's custom focus method first
    if ((_this$innerWrappedCon3 = this.innerWrappedControl) !== null && _this$innerWrappedCon3 !== void 0 && _this$innerWrappedCon3.focus) {
      this.innerWrappedControl.focus(path);
    } else {
      // Fall back to focusing by ID for simple widgets
      const element = document.getElementById(this.props.uniqueFieldId);
      element === null || element === void 0 ? void 0 : element.focus();
    }
    // After focusing, ensure the element is visible
    const label = document.querySelector(`label[for="${this.props.uniqueFieldId}"]`);
    if (label) {
      label.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }
  render() {
    const {
      controlComponent,
      entry,
      collection,
      config,
      field,
      value,
      mediaPaths,
      metadata,
      onChange,
      onValidateObject,
      onOpenMediaLibrary,
      onRemoveMediaControl,
      onPersistMedia,
      onClearMediaControl,
      onAddAsset,
      onRemoveInsertedMedia,
      getAsset,
      classNameWrapper,
      classNameWidget,
      classNameWidgetActive,
      classNameLabel,
      classNameLabelActive,
      setActiveStyle,
      hasActiveStyle,
      editorControl,
      uniqueFieldId,
      resolveWidget,
      widget,
      getEditorComponents,
      query,
      queryHits,
      clearSearch,
      clearFieldErrors,
      isFetching,
      loadEntry,
      fieldsErrors,
      controlRef,
      isEditorComponent,
      isNewEditorComponent,
      parentIds,
      t,
      isDisabled,
      isFieldDuplicate,
      isFieldHidden,
      locale,
      isParentListCollapsed
    } = this.props;
    return /*#__PURE__*/React.createElement(controlComponent, {
      entry,
      collection,
      config,
      field,
      value,
      mediaPaths,
      metadata,
      onChange,
      onChangeObject: this.onChangeObject,
      onValidateObject,
      onOpenMediaLibrary,
      onClearMediaControl,
      onRemoveMediaControl,
      onPersistMedia,
      onAddAsset,
      onRemoveInsertedMedia,
      getAsset,
      forID: uniqueFieldId,
      ref: this.processInnerControlRef,
      validate: this.validate,
      classNameWrapper,
      classNameWidget,
      classNameWidgetActive,
      classNameLabel,
      classNameLabelActive,
      setActiveStyle,
      setInactiveStyle: () => this.setInactiveStyle(),
      hasActiveStyle,
      editorControl,
      resolveWidget,
      widget,
      getEditorComponents,
      getRemarkPlugins,
      query,
      queryHits,
      clearSearch,
      clearFieldErrors,
      isFetching,
      loadEntry,
      isEditorComponent,
      isNewEditorComponent,
      fieldsErrors,
      controlRef,
      parentIds,
      t,
      isDisabled,
      isFieldDuplicate,
      isFieldHidden,
      locale,
      isParentListCollapsed
    });
  }
}
_defineProperty(Widget, "propTypes", {
  controlComponent: PropTypes.func.isRequired,
  field: ImmutablePropTypes.map.isRequired,
  hasActiveStyle: PropTypes.bool,
  setActiveStyle: PropTypes.func.isRequired,
  setInactiveStyle: PropTypes.func.isRequired,
  classNameWrapper: PropTypes.string.isRequired,
  classNameWidget: PropTypes.string.isRequired,
  classNameWidgetActive: PropTypes.string.isRequired,
  classNameLabel: PropTypes.string.isRequired,
  classNameLabelActive: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.node, PropTypes.object, PropTypes.string, PropTypes.bool]),
  mediaPaths: ImmutablePropTypes.map.isRequired,
  metadata: ImmutablePropTypes.map,
  fieldsErrors: ImmutablePropTypes.map,
  onChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func,
  controlRef: PropTypes.func,
  onOpenMediaLibrary: PropTypes.func.isRequired,
  onClearMediaControl: PropTypes.func.isRequired,
  onRemoveMediaControl: PropTypes.func.isRequired,
  onPersistMedia: PropTypes.func.isRequired,
  onAddAsset: PropTypes.func.isRequired,
  onRemoveInsertedMedia: PropTypes.func.isRequired,
  getAsset: PropTypes.func.isRequired,
  resolveWidget: PropTypes.func.isRequired,
  widget: PropTypes.object.isRequired,
  getEditorComponents: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  query: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  clearFieldErrors: PropTypes.func.isRequired,
  queryHits: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  editorControl: PropTypes.elementType.isRequired,
  uniqueFieldId: PropTypes.string.isRequired,
  loadEntry: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  onValidateObject: PropTypes.func,
  isEditorComponent: PropTypes.bool,
  isNewEditorComponent: PropTypes.bool,
  entry: ImmutablePropTypes.map.isRequired,
  isDisabled: PropTypes.bool,
  isFieldDuplicate: PropTypes.func,
  isFieldHidden: PropTypes.func,
  locale: PropTypes.string,
  isParentListCollapsed: PropTypes.bool
});