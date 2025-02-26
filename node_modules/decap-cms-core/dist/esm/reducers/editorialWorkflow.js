import _startsWith from "lodash/startsWith";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { Map, List, fromJS } from 'immutable';
import { EDITORIAL_WORKFLOW } from '../constants/publishModes';
import { UNPUBLISHED_ENTRY_REQUEST, UNPUBLISHED_ENTRY_REDIRECT, UNPUBLISHED_ENTRY_SUCCESS, UNPUBLISHED_ENTRIES_REQUEST, UNPUBLISHED_ENTRIES_SUCCESS, UNPUBLISHED_ENTRY_PERSIST_REQUEST, UNPUBLISHED_ENTRY_PERSIST_SUCCESS, UNPUBLISHED_ENTRY_PERSIST_FAILURE, UNPUBLISHED_ENTRY_STATUS_CHANGE_REQUEST, UNPUBLISHED_ENTRY_STATUS_CHANGE_SUCCESS, UNPUBLISHED_ENTRY_STATUS_CHANGE_FAILURE, UNPUBLISHED_ENTRY_PUBLISH_REQUEST, UNPUBLISHED_ENTRY_PUBLISH_SUCCESS, UNPUBLISHED_ENTRY_PUBLISH_FAILURE, UNPUBLISHED_ENTRY_DELETE_SUCCESS } from '../actions/editorialWorkflow';
import { CONFIG_SUCCESS } from '../actions/config';
function unpublishedEntries(state = Map(), action) {
  switch (action.type) {
    case CONFIG_SUCCESS:
      {
        const publishMode = action.payload && action.payload.publish_mode;
        if (publishMode === EDITORIAL_WORKFLOW) {
          //  Editorial workflow state is explicitly initiated after the config.
          return Map({
            entities: Map(),
            pages: Map()
          });
        }
        return state;
      }
    case UNPUBLISHED_ENTRY_REQUEST:
      return state.setIn(['entities', `${action.payload.collection}.${action.payload.slug}`, 'isFetching'], true);
    case UNPUBLISHED_ENTRY_REDIRECT:
      return state.deleteIn(['entities', `${action.payload.collection}.${action.payload.slug}`]);
    case UNPUBLISHED_ENTRY_SUCCESS:
      return state.setIn(['entities', `${action.payload.collection}.${action.payload.entry.slug}`], fromJS(action.payload.entry));
    case UNPUBLISHED_ENTRIES_REQUEST:
      return state.setIn(['pages', 'isFetching'], true);
    case UNPUBLISHED_ENTRIES_SUCCESS:
      return state.withMutations(map => {
        action.payload.entries.forEach(entry => map.setIn(['entities', `${entry.collection}.${entry.slug}`], fromJS(entry).set('isFetching', false)));
        map.set('pages', Map(_objectSpread(_objectSpread({}, action.payload.pages), {}, {
          ids: List(action.payload.entries.map(entry => entry.slug))
        })));
      });
    case UNPUBLISHED_ENTRY_PERSIST_REQUEST:
      {
        return state.setIn(['entities', `${action.payload.collection}.${action.payload.slug}`, 'isPersisting'], true);
      }
    case UNPUBLISHED_ENTRY_PERSIST_SUCCESS:
      // Update Optimistically
      return state.withMutations(map => {
        map.setIn(['entities', `${action.payload.collection}.${action.payload.entry.get('slug')}`], fromJS(action.payload.entry));
        map.deleteIn(['entities', `${action.payload.collection}.${action.payload.entry.get('slug')}`, 'isPersisting']);
        map.updateIn(['pages', 'ids'], List(), list => list.push(action.payload.entry.get('slug')));
      });
    case UNPUBLISHED_ENTRY_PERSIST_FAILURE:
      return state.setIn(['entities', `${action.payload.collection}.${action.payload.slug}`, 'isPersisting'], false);
    case UNPUBLISHED_ENTRY_STATUS_CHANGE_REQUEST:
      // Update Optimistically
      return state.setIn(['entities', `${action.payload.collection}.${action.payload.slug}`, 'isUpdatingStatus'], true);
    case UNPUBLISHED_ENTRY_STATUS_CHANGE_SUCCESS:
      return state.withMutations(map => {
        map.setIn(['entities', `${action.payload.collection}.${action.payload.slug}`, 'status'], action.payload.newStatus);
        map.setIn(['entities', `${action.payload.collection}.${action.payload.slug}`, 'isUpdatingStatus'], false);
      });
    case UNPUBLISHED_ENTRY_STATUS_CHANGE_FAILURE:
      return state.setIn(['entities', `${action.payload.collection}.${action.payload.slug}`, 'isUpdatingStatus'], false);
    case UNPUBLISHED_ENTRY_PUBLISH_REQUEST:
      return state.setIn(['entities', `${action.payload.collection}.${action.payload.slug}`, 'isPublishing'], true);
    case UNPUBLISHED_ENTRY_PUBLISH_SUCCESS:
      return state.deleteIn(['entities', `${action.payload.collection}.${action.payload.slug}`]);
    case UNPUBLISHED_ENTRY_DELETE_SUCCESS:
      return state.deleteIn(['entities', `${action.payload.collection}.${action.payload.slug}`]);
    case UNPUBLISHED_ENTRY_PUBLISH_FAILURE:
    default:
      return state;
  }
}
export function selectUnpublishedEntry(state, collection, slug) {
  return state && state.getIn(['entities', `${collection}.${slug}`]);
}
export function selectUnpublishedEntriesByStatus(state, status) {
  if (!state) return null;
  const entities = state.get('entities');
  return entities.filter(entry => entry.get('status') === status).valueSeq();
}
export function selectUnpublishedSlugs(state, collection) {
  if (!state.get('entities')) return null;
  const entities = state.get('entities');
  return entities.filter((_v, k) => _startsWith(k, `${collection}.`)).map(entry => entry.get('slug')).valueSeq();
}
export default unpublishedEntries;