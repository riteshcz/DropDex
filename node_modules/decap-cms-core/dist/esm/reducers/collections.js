import _escapeRegExp from "lodash/escapeRegExp";
import _get from "lodash/get";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { List, Set, fromJS, OrderedMap } from 'immutable';
import { stringTemplate } from 'decap-cms-lib-widgets';
import consoleError from '../lib/consoleError';
import { CONFIG_SUCCESS } from '../actions/config';
import { FILES, FOLDER } from '../constants/collectionTypes';
import { COMMIT_DATE, COMMIT_AUTHOR } from '../constants/commitProps';
import { INFERABLE_FIELDS, IDENTIFIER_FIELDS, SORTABLE_FIELDS } from '../constants/fieldInference';
import { getFormatExtensions } from '../formats/formats';
import { selectMediaFolder } from './entries';
import { summaryFormatter } from '../lib/formatters';
const {
  keyToPathArray
} = stringTemplate;
const defaultState = fromJS({});
function collections(state = defaultState, action) {
  switch (action.type) {
    case CONFIG_SUCCESS:
      {
        const collections = action.payload.collections;
        let newState = OrderedMap({});
        collections.forEach(collection => {
          newState = newState.set(collection.name, fromJS(collection));
        });
        return newState;
      }
    default:
      return state;
  }
}
const selectors = {
  [FOLDER]: {
    entryExtension(collection) {
      const ext = collection.get('extension') || _get(getFormatExtensions(), collection.get('format') || 'frontmatter');
      if (!ext) {
        throw new Error(`No extension found for format ${collection.get('format')}`);
      }
      return ext.replace(/^\./, '');
    },
    fields(collection) {
      return collection.get('fields');
    },
    entryPath(collection, slug) {
      const folder = collection.get('folder').replace(/\/$/, '');
      return `${folder}/${slug}.${this.entryExtension(collection)}`;
    },
    entrySlug(collection, path) {
      var _path$split$pop;
      const folder = collection.get('folder').replace(/\/$/, '');
      const slug = (_path$split$pop = path.split(folder + '/').pop()) === null || _path$split$pop === void 0 ? void 0 : _path$split$pop.replace(new RegExp(`\\.${_escapeRegExp(this.entryExtension(collection))}$`), '');
      return slug;
    },
    allowNewEntries(collection) {
      return collection.get('create');
    },
    allowDeletion(collection) {
      return collection.get('delete', true);
    },
    templateName(collection) {
      return collection.get('name');
    }
  },
  [FILES]: {
    fileForEntry(collection, slug) {
      const files = collection.get('files');
      return files && files.filter(f => (f === null || f === void 0 ? void 0 : f.get('name')) === slug).get(0);
    },
    fields(collection, slug) {
      const file = this.fileForEntry(collection, slug);
      return file && file.get('fields');
    },
    entryPath(collection, slug) {
      const file = this.fileForEntry(collection, slug);
      return file && file.get('file');
    },
    entrySlug(collection, path) {
      const file = collection.get('files').filter(f => (f === null || f === void 0 ? void 0 : f.get('file')) === path).get(0);
      return file && file.get('name');
    },
    entryLabel(collection, slug) {
      const file = this.fileForEntry(collection, slug);
      return file && file.get('label');
    },
    allowNewEntries() {
      return false;
    },
    allowDeletion(collection) {
      return collection.get('delete', false);
    },
    templateName(_collection, slug) {
      return slug;
    }
  }
};
function getFieldsWithMediaFolders(fields) {
  const fieldsWithMediaFolders = fields.reduce((acc, f) => {
    if (f.has('media_folder')) {
      acc = [...acc, f];
    }
    if (f.has('fields')) {
      var _f$get;
      const fields = (_f$get = f.get('fields')) === null || _f$get === void 0 ? void 0 : _f$get.toArray();
      acc = [...acc, ...getFieldsWithMediaFolders(fields)];
    } else if (f.has('field')) {
      const field = f.get('field');
      acc = [...acc, ...getFieldsWithMediaFolders([field])];
    } else if (f.has('types')) {
      var _f$get2;
      const types = (_f$get2 = f.get('types')) === null || _f$get2 === void 0 ? void 0 : _f$get2.toArray();
      acc = [...acc, ...getFieldsWithMediaFolders(types)];
    }
    return acc;
  }, []);
  return fieldsWithMediaFolders;
}
export function getFileFromSlug(collection, slug) {
  var _collection$get;
  return (_collection$get = collection.get('files')) === null || _collection$get === void 0 ? void 0 : _collection$get.toArray().find(f => f.get('name') === slug);
}
export function selectFieldsWithMediaFolders(collection, slug) {
  if (collection.has('folder')) {
    const fields = collection.get('fields').toArray();
    return getFieldsWithMediaFolders(fields);
  } else if (collection.has('files')) {
    var _getFileFromSlug;
    const fields = ((_getFileFromSlug = getFileFromSlug(collection, slug)) === null || _getFileFromSlug === void 0 ? void 0 : _getFileFromSlug.get('fields').toArray()) || [];
    return getFieldsWithMediaFolders(fields);
  }
  return [];
}
export function selectMediaFolders(config, collection, entry) {
  const fields = selectFieldsWithMediaFolders(collection, entry.get('slug'));
  const folders = fields.map(f => selectMediaFolder(config, collection, entry, f));
  if (collection.has('files')) {
    const file = getFileFromSlug(collection, entry.get('slug'));
    if (file) {
      folders.unshift(selectMediaFolder(config, collection, entry, undefined));
    }
  }
  if (collection.has('media_folder')) {
    // stop evaluating media folders at collection level
    collection = collection.delete('files');
    folders.unshift(selectMediaFolder(config, collection, entry, undefined));
  }
  return Set(folders).toArray();
}
export function selectFields(collection, slug) {
  return selectors[collection.get('type')].fields(collection, slug);
}
export function selectFolderEntryExtension(collection) {
  return selectors[FOLDER].entryExtension(collection);
}
export function selectFileEntryLabel(collection, slug) {
  return selectors[FILES].entryLabel(collection, slug);
}
export function selectEntryPath(collection, slug) {
  return selectors[collection.get('type')].entryPath(collection, slug);
}
export function selectEntrySlug(collection, path) {
  return selectors[collection.get('type')].entrySlug(collection, path);
}
export function selectAllowNewEntries(collection) {
  return selectors[collection.get('type')].allowNewEntries(collection);
}
export function selectAllowDeletion(collection) {
  return selectors[collection.get('type')].allowDeletion(collection);
}
export function selectTemplateName(collection, slug) {
  return selectors[collection.get('type')].templateName(collection, slug);
}
export function getFieldsNames(fields, prefix = '') {
  let names = fields.map(f => `${prefix}${f.get('name')}`);
  fields.forEach((f, index) => {
    if (f.has('fields')) {
      var _f$get3;
      const fields = (_f$get3 = f.get('fields')) === null || _f$get3 === void 0 ? void 0 : _f$get3.toArray();
      names = [...names, ...getFieldsNames(fields, `${names[index]}.`)];
    } else if (f.has('field')) {
      const field = f.get('field');
      names = [...names, ...getFieldsNames([field], `${names[index]}.`)];
    } else if (f.has('types')) {
      var _f$get4;
      const types = (_f$get4 = f.get('types')) === null || _f$get4 === void 0 ? void 0 : _f$get4.toArray();
      names = [...names, ...getFieldsNames(types, `${names[index]}.`)];
    }
  });
  return names;
}
export function selectField(collection, key) {
  const array = keyToPathArray(key);
  let name;
  let field;
  let fields = collection.get('fields', List()).toArray();
  while ((name = array.shift()) && fields) {
    var _field, _field3, _field5;
    field = fields.find(f => f.get('name') === name);
    if ((_field = field) !== null && _field !== void 0 && _field.has('fields')) {
      var _field2, _field2$get;
      fields = (_field2 = field) === null || _field2 === void 0 ? void 0 : (_field2$get = _field2.get('fields')) === null || _field2$get === void 0 ? void 0 : _field2$get.toArray();
    } else if ((_field3 = field) !== null && _field3 !== void 0 && _field3.has('field')) {
      var _field4;
      fields = [(_field4 = field) === null || _field4 === void 0 ? void 0 : _field4.get('field')];
    } else if ((_field5 = field) !== null && _field5 !== void 0 && _field5.has('types')) {
      var _field6, _field6$get;
      fields = (_field6 = field) === null || _field6 === void 0 ? void 0 : (_field6$get = _field6.get('types')) === null || _field6$get === void 0 ? void 0 : _field6$get.toArray();
    }
  }
  return field;
}
export function traverseFields(fields, updater, done = () => false) {
  if (done()) {
    return fields;
  }
  fields = fields.map(f => {
    const field = updater(f);
    if (done()) {
      return field;
    } else if (field.has('fields')) {
      return field.set('fields', traverseFields(field.get('fields'), updater, done));
    } else if (field.has('field')) {
      return field.set('field', traverseFields(List([field.get('field')]), updater, done).get(0));
    } else if (field.has('types')) {
      return field.set('types', traverseFields(field.get('types'), updater, done));
    } else {
      return field;
    }
  }).toList();
  return fields;
}
export function updateFieldByKey(collection, key, updater) {
  const selected = selectField(collection, key);
  if (!selected) {
    return collection;
  }
  let updated = false;
  function updateAndBreak(f) {
    const field = f;
    if (field === selected) {
      updated = true;
      return updater(field);
    } else {
      return field;
    }
  }
  collection = collection.set('fields', traverseFields(collection.get('fields', List()), updateAndBreak, () => updated));
  return collection;
}
export function selectIdentifier(collection) {
  const identifier = collection.get('identifier_field');
  const identifierFields = identifier ? [identifier, ...IDENTIFIER_FIELDS] : [...IDENTIFIER_FIELDS];
  const fieldNames = getFieldsNames(collection.get('fields', List()).toArray());
  return identifierFields.find(id => fieldNames.find(name => name.toLowerCase().trim() === id.toLowerCase().trim()));
}
export function selectInferredField(collection, fieldName) {
  if (fieldName === 'title' && collection.get('identifier_field')) {
    return selectIdentifier(collection);
  }
  const inferableField = INFERABLE_FIELDS[fieldName];
  const fields = collection.get('fields');
  let field;

  // If collection has no fields or fieldName is not defined within inferables list, return null
  if (!fields || !inferableField) return null;
  // Try to return a field of the specified type with one of the synonyms
  const mainTypeFields = fields.filter(f => (f === null || f === void 0 ? void 0 : f.get('widget', 'string')) === inferableField.type).map(f => f === null || f === void 0 ? void 0 : f.get('name'));
  field = mainTypeFields.filter(f => inferableField.synonyms.indexOf(f) !== -1);
  if (field && field.size > 0) return field.first();

  // Try to return a field for each of the specified secondary types
  const secondaryTypeFields = fields.filter(f => inferableField.secondaryTypes.indexOf(f === null || f === void 0 ? void 0 : f.get('widget', 'string')) !== -1).map(f => f === null || f === void 0 ? void 0 : f.get('name'));
  field = secondaryTypeFields.filter(f => inferableField.synonyms.indexOf(f) !== -1);
  if (field && field.size > 0) return field.first();

  // Try to return the first field of the specified type
  if (inferableField.fallbackToFirstField && mainTypeFields.size > 0) return mainTypeFields.first();

  // Coundn't infer the field. Show error and return null.
  if (inferableField.showError) {
    consoleError(`The Field ${fieldName} is missing for the collection “${collection.get('name')}”`, `Decap CMS tries to infer the entry ${fieldName} automatically, but one couldn't be found for entries of the collection “${collection.get('name')}”. Please check your site configuration.`);
  }
  return null;
}
export function selectEntryCollectionTitle(collection, entry) {
  // prefer formatted summary over everything else
  const summaryTemplate = collection.get('summary');
  if (summaryTemplate) return summaryFormatter(summaryTemplate, entry, collection);

  // if the collection is a file collection return the label of the entry
  if (collection.get('type') == FILES) {
    const label = selectFileEntryLabel(collection, entry.get('slug'));
    if (label) return label;
  }

  // try to infer a title field from the entry data
  const entryData = entry.get('data');
  const titleField = selectInferredField(collection, 'title');
  const result = titleField && entryData.getIn(keyToPathArray(titleField));

  // if the custom field does not yield a result, fallback to 'title'
  if (!result && titleField !== 'title') {
    return entryData.getIn(keyToPathArray('title'));
  }
  return result;
}
export function selectDefaultSortableFields(collection, backend, hasIntegration) {
  let defaultSortable = SORTABLE_FIELDS.map(type => {
    const field = selectInferredField(collection, type);
    if (backend.isGitBackend() && type === 'author' && !field && !hasIntegration) {
      // default to commit author if not author field is found
      return COMMIT_AUTHOR;
    }
    return field;
  }).filter(Boolean);
  if (backend.isGitBackend() && !hasIntegration) {
    // always have commit date by default
    defaultSortable = [COMMIT_DATE, ...defaultSortable];
  }
  return defaultSortable;
}
export function selectSortableFields(collection, t) {
  const fields = collection.get('sortable_fields').toArray().map(key => {
    if (key === COMMIT_DATE) {
      return {
        key,
        field: {
          name: key,
          label: t('collection.defaultFields.updatedOn.label')
        }
      };
    }
    const field = selectField(collection, key);
    if (key === COMMIT_AUTHOR && !field) {
      return {
        key,
        field: {
          name: key,
          label: t('collection.defaultFields.author.label')
        }
      };
    }
    return {
      key,
      field: field === null || field === void 0 ? void 0 : field.toJS()
    };
  }).filter(item => !!item.field).map(item => _objectSpread(_objectSpread({}, item.field), {}, {
    key: item.key
  }));
  return fields;
}
export function selectSortDataPath(collection, key) {
  if (key === COMMIT_DATE) {
    return 'updatedOn';
  } else if (key === COMMIT_AUTHOR && !selectField(collection, key)) {
    return 'author';
  } else {
    return `data.${key}`;
  }
}
export function selectViewFilters(collection) {
  const viewFilters = collection.get('view_filters').toJS();
  return viewFilters;
}
export function selectViewGroups(collection) {
  const viewGroups = collection.get('view_groups').toJS();
  return viewGroups;
}
export function selectFieldsComments(collection, entryMap) {
  let fields = [];
  if (collection.has('folder')) {
    fields = collection.get('fields').toArray();
  } else if (collection.has('files')) {
    const file = collection.get('files').find(f => (f === null || f === void 0 ? void 0 : f.get('name')) === entryMap.get('slug'));
    fields = file.get('fields').toArray();
  }
  const comments = {};
  const names = getFieldsNames(fields);
  names.forEach(name => {
    const field = selectField(collection, name);
    if (field !== null && field !== void 0 && field.has('comment')) {
      comments[name] = field.get('comment');
    }
  });
  return comments;
}
export function selectHasMetaPath(collection) {
  var _collection$get2;
  return collection.has('folder') && collection.get('type') === FOLDER && collection.has('meta') && ((_collection$get2 = collection.get('meta')) === null || _collection$get2 === void 0 ? void 0 : _collection$get2.has('path'));
}
export default collections;