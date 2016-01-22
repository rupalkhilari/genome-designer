export default function(file, api) {
  const j = api.jscodeshift;
  const { expression, statement, statements } = j.template;

  return j(file.source)
    .find(j.ClassProperty)
    .replaceWith(p => {
      p.node.end++;
      return p.node;
    })
    .toSource();
};