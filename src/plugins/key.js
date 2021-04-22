export default function key(pre) {
  return `${pre}_${new Date().getTime()}`;
}
