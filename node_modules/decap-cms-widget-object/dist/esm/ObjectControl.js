function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ClassNames } from '@emotion/react';
import { List, Map } from 'immutable';
import { colors, lengths, ObjectWidgetTopBar } from 'decap-cms-ui-default';
import { stringTemplate } from 'decap-cms-lib-widgets';
import { jsx as ___EmotionJSX } from "@emotion/react";
const styleStrings = {
  nestedObjectControl: `
    padding: 6px 14px 14px;
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `,
  objectWidgetTopBarContainer: `
    padding: ${lengths.objectWidgetTopBarContainerPadding};
  `,
  collapsedObjectControl: `
    display: none;
  `
};
export default class ObjectControl extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "childRefs", {});
    _defineProperty(this, "processControlRef", ref => {
      var _this$props$controlRe, _this$props;
      if (!ref) return;
      const name = ref.props.field.get('name');
      this.childRefs[name] = ref;
      (_this$props$controlRe = (_this$props = this.props).controlRef) === null || _this$props$controlRe === void 0 ? void 0 : _this$props$controlRe.call(_this$props, ref);
    });
    _defineProperty(this, "validate", () => {
      const {
        field
      } = this.props;
      let fields = field.get('field') || field.get('fields');
      fields = List.isList(fields) ? fields : List([fields]);
      fields.forEach(field => {
        var _control$innerWrapped;
        if (field.get('widget') === 'hidden') return;
        const name = field.get('name');
        const control = this.childRefs[name];
        if (control !== null && control !== void 0 && (_control$innerWrapped = control.innerWrappedControl) !== null && _control$innerWrapped !== void 0 && _control$innerWrapped.validate) {
          control.innerWrappedControl.validate();
        } else {
          var _control$validate;
          control === null || control === void 0 ? void 0 : (_control$validate = control.validate) === null || _control$validate === void 0 ? void 0 : _control$validate.call(control);
        }
      });
    });
    _defineProperty(this, "handleCollapseToggle", () => {
      this.setState({
        collapsed: !this.state.collapsed
      });
    });
    _defineProperty(this, "renderFields", (multiFields, singleField) => {
      if (multiFields) {
        return multiFields.map((f, idx) => this.controlFor(f, idx));
      }
      return this.controlFor(singleField);
    });
    _defineProperty(this, "objectLabel", () => {
      const {
        value,
        field
      } = this.props;
      const label = field.get('label', field.get('name'));
      const summary = field.get('summary');
      return summary ? stringTemplate.compileStringTemplate(summary, null, '', value) : label;
    });
    this.state = {
      collapsed: props.field.get('collapsed', false)
    };
  }

  /*
   * Always update so that each nested widget has the option to update. This is
   * required because ControlHOC provides a default `shouldComponentUpdate`
   * which only updates if the value changes, but every widget must be allowed
   * to override this.
   */
  shouldComponentUpdate() {
    return true;
  }
  controlFor(field, key) {
    const {
      value,
      onChangeObject,
      onValidateObject,
      clearFieldErrors,
      metadata,
      fieldsErrors,
      editorControl: EditorControl,
      parentIds,
      isFieldDuplicate,
      isFieldHidden,
      locale,
      collapsed,
      forID
    } = this.props;
    if (field.get('widget') === 'hidden') {
      return null;
    }
    const fieldName = field.get('name');
    const fieldValue = value && Map.isMap(value) ? value.get(fieldName) : value;
    const isDuplicate = isFieldDuplicate && isFieldDuplicate(field);
    const isHidden = isFieldHidden && isFieldHidden(field);
    return ___EmotionJSX(EditorControl, {
      key: key,
      field: field,
      value: fieldValue,
      onChange: onChangeObject,
      clearFieldErrors: clearFieldErrors,
      fieldsMetaData: metadata,
      fieldsErrors: fieldsErrors,
      onValidate: onValidateObject,
      controlRef: this.processControlRef,
      parentIds: [...parentIds, forID],
      isDisabled: isDuplicate,
      isHidden: isHidden,
      isFieldDuplicate: isFieldDuplicate,
      isFieldHidden: isFieldHidden,
      locale: locale,
      isParentListCollapsed: collapsed
    });
  }
  focus(path) {
    if (this.state.collapsed) {
      this.setState({
        collapsed: false
      }, () => {
        if (path) {
          const [fieldName, ...remainingPath] = path.split('.');
          const field = this.childRefs[fieldName];
          if (field !== null && field !== void 0 && field.focus) {
            field.focus(remainingPath.join('.'));
          }
        }
      });
    } else if (path) {
      const [fieldName, ...remainingPath] = path.split('.');
      const field = this.childRefs[fieldName];
      if (field !== null && field !== void 0 && field.focus) {
        field.focus(remainingPath.join('.'));
      }
    }
  }
  render() {
    const {
      field,
      forID,
      classNameWrapper,
      forList,
      hasError,
      t
    } = this.props;
    const collapsed = forList ? this.props.collapsed : this.state.collapsed;
    const multiFields = field.get('fields');
    const singleField = field.get('field');
    if (multiFields || singleField) {
      return ___EmotionJSX(ClassNames, null, ({
        css,
        cx
      }) => ___EmotionJSX("div", {
        id: forID,
        className: cx(classNameWrapper, css`
                  ${styleStrings.objectWidgetTopBarContainer}
                `, {
          [css`
                    ${styleStrings.nestedObjectControl}
                  `]: forList
        }, {
          [css`
                    border-color: ${colors.textFieldBorder};
                  `]: forList ? !hasError : false
        })
      }, forList ? null : ___EmotionJSX(ObjectWidgetTopBar, {
        collapsed: collapsed,
        onCollapseToggle: this.handleCollapseToggle,
        heading: collapsed && this.objectLabel(),
        t: t
      }), ___EmotionJSX("div", {
        className: cx({
          [css`
                    ${styleStrings.collapsedObjectControl}
                  `]: collapsed
        })
      }, this.renderFields(multiFields, singleField))));
    }
    return ___EmotionJSX("h3", null, "No field(s) defined for this widget");
  }
}
_defineProperty(ObjectControl, "propTypes", {
  onChangeObject: PropTypes.func.isRequired,
  onValidateObject: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.node, PropTypes.object, PropTypes.bool]),
  field: PropTypes.object,
  forID: PropTypes.string,
  classNameWrapper: PropTypes.string.isRequired,
  forList: PropTypes.bool,
  controlRef: PropTypes.func,
  editorControl: PropTypes.elementType.isRequired,
  resolveWidget: PropTypes.func.isRequired,
  clearFieldErrors: PropTypes.func.isRequired,
  fieldsErrors: ImmutablePropTypes.map,
  hasError: PropTypes.bool,
  t: PropTypes.func,
  locale: PropTypes.string,
  collapsed: PropTypes.bool
});
_defineProperty(ObjectControl, "defaultProps", {
  value: Map()
});