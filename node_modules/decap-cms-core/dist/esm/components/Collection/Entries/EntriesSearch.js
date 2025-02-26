import _isEqual from "lodash/isEqual";
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Cursor } from 'decap-cms-lib-util';
import { selectSearchedEntries } from '../../../reducers';
import { searchEntries as actionSearchEntries, clearSearch as actionClearSearch } from '../../../actions/search';
import Entries from './Entries';
import { jsx as ___EmotionJSX } from "@emotion/react";
class EntriesSearch extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "getCursor", () => {
      const {
        page
      } = this.props;
      return Cursor.create({
        actions: isNaN(page) ? [] : ['append_next']
      });
    });
    _defineProperty(this, "handleCursorActions", action => {
      const {
        page,
        searchTerm,
        searchEntries,
        collectionNames
      } = this.props;
      if (action === 'append_next') {
        const nextPage = page + 1;
        searchEntries(searchTerm, collectionNames, nextPage);
      }
    });
  }
  componentDidMount() {
    const {
      searchTerm,
      searchEntries,
      collectionNames
    } = this.props;
    searchEntries(searchTerm, collectionNames);
  }
  componentDidUpdate(prevProps) {
    const {
      searchTerm,
      collectionNames
    } = this.props;

    // check if the search parameters are the same
    if (prevProps.searchTerm === searchTerm && _isEqual(prevProps.collectionNames, collectionNames)) return;
    const {
      searchEntries
    } = prevProps;
    searchEntries(searchTerm, collectionNames);
  }
  componentWillUnmount() {
    this.props.clearSearch();
  }
  render() {
    const {
      collections,
      entries,
      isFetching
    } = this.props;
    return ___EmotionJSX(Entries, {
      cursor: this.getCursor(),
      handleCursorActions: this.handleCursorActions,
      collections: collections,
      entries: entries,
      isFetching: isFetching
    });
  }
}
_defineProperty(EntriesSearch, "propTypes", {
  isFetching: PropTypes.bool,
  searchEntries: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  collections: ImmutablePropTypes.seq,
  collectionNames: PropTypes.array,
  entries: ImmutablePropTypes.list,
  page: PropTypes.number
});
function mapStateToProps(state, ownProps) {
  const {
    searchTerm
  } = ownProps;
  const collections = ownProps.collections.toIndexedSeq();
  const collectionNames = ownProps.collections.keySeq().toArray();
  const isFetching = state.search.isFetching;
  const page = state.search.page;
  const entries = selectSearchedEntries(state, collectionNames);
  return {
    isFetching,
    page,
    collections,
    collectionNames,
    entries,
    searchTerm
  };
}
const mapDispatchToProps = {
  searchEntries: actionSearchEntries,
  clearSearch: actionClearSearch
};
export default connect(mapStateToProps, mapDispatchToProps)(EntriesSearch);