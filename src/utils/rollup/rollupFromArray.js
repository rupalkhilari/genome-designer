//for use when want to pass an array of blocks
export default function rollupFromArray(project, ...blocks) {
  return {
    project,
    blocks: blocks.reduce((acc, block) => Object.assign(acc, { [block.id]: block }), {}),
  };
}
