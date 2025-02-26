import getActiveLink from '../selectors/getActiveLink';
import unwrapLink from '../transforms/unwrapLink';
import wrapLink from '../transforms/wrapLink';
function toggleLink(editor, promptText) {
  var _activeLink$, _activeLink$$data;
  const activeLink = getActiveLink(editor);
  const activeUrl = activeLink ? (_activeLink$ = activeLink[0]) === null || _activeLink$ === void 0 ? void 0 : (_activeLink$$data = _activeLink$.data) === null || _activeLink$$data === void 0 ? void 0 : _activeLink$$data.url : '';
  const url = window.prompt(promptText, activeUrl);
  if (url == null) return;
  if (url === '') {
    unwrapLink(editor);
    return;
  }
  wrapLink(editor, url);
}
export default toggleLink;