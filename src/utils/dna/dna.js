const makeRegexp = (string) => {
  return new RegExp(`^[${string}]*$`, 'gi');
};

//use functions which return a new regex so that .test() and .exec() which use lastIndex should not have effect on multiple calls

// bases for dna ( strict )
export const dnaStrict = 'acgtu';
export const dnaStrictRegexp = () => makeRegexp(dnaStrict);

// bases for dna loose including special chars ( regex format )
export const dnaLoose = 'acgturyswkmbdhvn\\.\\-';
export const dnaLooseRegexp = () => makeRegexp(dnaLoose);
