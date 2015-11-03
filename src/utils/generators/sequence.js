export default function sequence (length, monomers = 'acgt') {
  let seq   = [],
      monos = monomers.split('');
  for (let i = 0; i < length; i++) {
    let rando = Math.floor(Math.random() * 4);
    seq.push(monos[rando]);
  }
  return seq.join('');
}