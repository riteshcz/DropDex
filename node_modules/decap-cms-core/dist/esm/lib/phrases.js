import _merge from "lodash/merge";
import { getLocale } from './registry';
export function getPhrases(locale) {
  const phrases = _merge({}, getLocale('en'), getLocale(locale));
  return phrases;
}