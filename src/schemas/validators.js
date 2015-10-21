//validates an ID
export const id = (input) => {
  //todo - real validation
  if (input.length === 0) {
    return new Error('invalid id!');
  }
};