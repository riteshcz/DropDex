"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("@emotion/styled/base"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _decapCmsLibAuth = require("decap-cms-lib-auth");
var _decapCmsUiDefault = require("decap-cms-ui-default");
var _react2 = require("@emotion/react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }
const LoginButtonIcon = /*#__PURE__*/(0, _base.default)(_decapCmsUiDefault.Icon, {
  target: "es1j68m0",
  label: "LoginButtonIcon"
})(process.env.NODE_ENV === "production" ? {
  name: "1gnqu05",
  styles: "margin-right:18px"
} : {
  name: "1gnqu05",
  styles: "margin-right:18px",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9BdXRoZW50aWNhdGlvblBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTW9DIiwiZmlsZSI6Ii4uLy4uL3NyYy9BdXRoZW50aWNhdGlvblBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCB7IFBrY2VBdXRoZW50aWNhdG9yIH0gZnJvbSAnZGVjYXAtY21zLWxpYi1hdXRoJztcbmltcG9ydCB7IEF1dGhlbnRpY2F0aW9uUGFnZSwgSWNvbiB9IGZyb20gJ2RlY2FwLWNtcy11aS1kZWZhdWx0JztcblxuY29uc3QgTG9naW5CdXR0b25JY29uID0gc3R5bGVkKEljb24pYFxuICBtYXJnaW4tcmlnaHQ6IDE4cHg7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRlYUF1dGhlbnRpY2F0aW9uUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgb25Mb2dpbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHN0YXRlID0ge307XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgeyBiYXNlX3VybCA9ICdodHRwczovL3RyeS5naXRlYS5pbycsIGFwcF9pZCA9ICcnIH0gPSB0aGlzLnByb3BzLmNvbmZpZy5iYWNrZW5kO1xuICAgIHRoaXMuYXV0aCA9IG5ldyBQa2NlQXV0aGVudGljYXRvcih7XG4gICAgICBiYXNlX3VybCxcbiAgICAgIGF1dGhfZW5kcG9pbnQ6ICdsb2dpbi9vYXV0aC9hdXRob3JpemUnLFxuICAgICAgYXBwX2lkLFxuICAgICAgYXV0aF90b2tlbl9lbmRwb2ludDogJ2xvZ2luL29hdXRoL2FjY2Vzc190b2tlbicsXG4gICAgICBhdXRoX3Rva2VuX2VuZHBvaW50X2NvbnRlbnRfdHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgIH0pO1xuICAgIC8vIENvbXBsZXRlIGF1dGhlbnRpY2F0aW9uIGlmIHdlIHdlcmUgcmVkaXJlY3RlZCBiYWNrIHRvIGZyb20gdGhlIHByb3ZpZGVyLlxuICAgIHRoaXMuYXV0aC5jb21wbGV0ZUF1dGgoKGVyciwgZGF0YSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbG9naW5FcnJvcjogZXJyLnRvU3RyaW5nKCkgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uTG9naW4oZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVMb2dpbiA9IGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmF1dGguYXV0aGVudGljYXRlKHsgc2NvcGU6ICdyZXBvc2l0b3J5JyB9LCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBsb2dpbkVycm9yOiBlcnIudG9TdHJpbmcoKSB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5vbkxvZ2luKGRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGluUHJvZ3Jlc3MsIGNvbmZpZywgdCB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEF1dGhlbnRpY2F0aW9uUGFnZVxuICAgICAgICBvbkxvZ2luPXt0aGlzLmhhbmRsZUxvZ2lufVxuICAgICAgICBsb2dpbkRpc2FibGVkPXtpblByb2dyZXNzfVxuICAgICAgICBsb2dpbkVycm9yTWVzc2FnZT17dGhpcy5zdGF0ZS5sb2dpbkVycm9yfVxuICAgICAgICBsb2dvVXJsPXtjb25maWcubG9nb191cmx9XG4gICAgICAgIHNpdGVVcmw9e2NvbmZpZy5zaXRlX3VybH1cbiAgICAgICAgcmVuZGVyQnV0dG9uQ29udGVudD17KCkgPT4gKFxuICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICAgIDxMb2dpbkJ1dHRvbkljb24gdHlwZT1cImdpdGVhXCIgLz57JyAnfVxuICAgICAgICAgICAge2luUHJvZ3Jlc3MgPyB0KCdhdXRoLmxvZ2dpbmdJbicpIDogdCgnYXV0aC5sb2dpbldpdGhHaXRlYScpfVxuICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICl9XG4gICAgICAgIHQ9e3R9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ== */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});
class GiteaAuthenticationPage extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {});
    _defineProperty(this, "handleLogin", e => {
      e.preventDefault();
      this.auth.authenticate({
        scope: 'repository'
      }, (err, data) => {
        if (err) {
          this.setState({
            loginError: err.toString()
          });
          return;
        }
        this.props.onLogin(data);
      });
    });
  }
  componentDidMount() {
    const {
      base_url = 'https://try.gitea.io',
      app_id = ''
    } = this.props.config.backend;
    this.auth = new _decapCmsLibAuth.PkceAuthenticator({
      base_url,
      auth_endpoint: 'login/oauth/authorize',
      app_id,
      auth_token_endpoint: 'login/oauth/access_token',
      auth_token_endpoint_content_type: 'application/json; charset=utf-8'
    });
    // Complete authentication if we were redirected back to from the provider.
    this.auth.completeAuth((err, data) => {
      if (err) {
        this.setState({
          loginError: err.toString()
        });
        return;
      } else if (data) {
        this.props.onLogin(data);
      }
    });
  }
  render() {
    const {
      inProgress,
      config,
      t
    } = this.props;
    return (0, _react2.jsx)(_decapCmsUiDefault.AuthenticationPage, {
      onLogin: this.handleLogin,
      loginDisabled: inProgress,
      loginErrorMessage: this.state.loginError,
      logoUrl: config.logo_url,
      siteUrl: config.site_url,
      renderButtonContent: () => (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(LoginButtonIcon, {
        type: "gitea"
      }), ' ', inProgress ? t('auth.loggingIn') : t('auth.loginWithGitea')),
      t: t
    });
  }
}
exports.default = GiteaAuthenticationPage;
_defineProperty(GiteaAuthenticationPage, "propTypes", {
  inProgress: _propTypes.default.bool,
  config: _propTypes.default.object.isRequired,
  onLogin: _propTypes.default.func.isRequired,
  t: _propTypes.default.func.isRequired
});