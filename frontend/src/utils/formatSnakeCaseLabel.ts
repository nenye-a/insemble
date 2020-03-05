export default function formatSnakeCaseLabel(value: string) {
  let replaced = value.replace('_', ' ');
  let formatted = replaced[0].toUpperCase() + replaced.substr(1);
  return formatted;
}
