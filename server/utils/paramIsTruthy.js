export default function paramIsTruthy(param) {
  return (param !== undefined && param !== 'false') || param === true;
}
