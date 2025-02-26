import _isArray from "lodash/isArray";
import _castArray from "lodash/castArray";
export function assertType(nodes, type) {
  const nodesArray = _castArray(nodes);
  const validate = _isArray(type) ? node => type.includes(node.type) : node => type === node.type;
  const invalidNode = nodesArray.find(node => !validate(node));
  if (invalidNode) {
    throw Error(`Expected node of type "${type}", received "${invalidNode.type}".`);
  }
  return true;
}