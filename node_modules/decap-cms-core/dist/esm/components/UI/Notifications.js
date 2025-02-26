function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
// import { translate } from 'react-polyglot';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { toast, ToastContainer } from 'react-toastify';
import { connect, useDispatch } from 'react-redux';
import { useTranslate } from 'react-polyglot';
import { dismissNotification } from '../../actions/notifications';
import { jsx as ___EmotionJSX } from "@emotion/react";
injectStyle();
function Notifications({
  notifications
}) {
  const t = useTranslate();
  const dispatch = useDispatch();
  const [idMap, setIdMap] = React.useState({});
  useEffect(() => {
    notifications.filter(notification => !idMap[notification.id]).forEach(notification => {
      const toastId = toast(typeof notification.message == 'string' ? notification.message : t(notification.message.key, _objectSpread({}, notification.message)), {
        autoClose: notification.dismissAfter,
        type: notification.type
      });
      idMap[notification.id] = toastId;
      setIdMap(idMap);
      if (notification.dismissAfter) {
        setTimeout(() => {
          dispatch(dismissNotification(notification.id));
        }, notification.dismissAfter);
      }
    });
    Object.entries(idMap).forEach(([id, toastId]) => {
      if (!notifications.find(notification => notification.id === id)) {
        toast.dismiss(toastId);
        delete idMap[id];
        setIdMap(idMap);
      }
    });
  }, [notifications]);
  toast.onChange(payload => {
    if (payload.status == 'removed') {
      var _Object$entries$find;
      const id = (_Object$entries$find = Object.entries(idMap).find(([, toastId]) => toastId === payload.id)) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[0];
      if (id) {
        dispatch(dismissNotification(id));
      }
    }
  });
  return ___EmotionJSX(React.Fragment, null, ___EmotionJSX(ToastContainer, {
    position: "top-right",
    theme: "colored",
    className: "notif__container"
  }));
}
function mapStateToProps({
  notifications
}) {
  return {
    notifications: notifications.notifications
  };
}
export default connect(mapStateToProps)(Notifications);