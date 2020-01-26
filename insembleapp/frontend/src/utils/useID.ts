let idPrefix = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
let idCounter = 0;

export default function useID() {
  let id = idPrefix + idCounter.toString(36);
  idCounter += 1;
  return id;
}
