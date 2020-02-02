export default function urlEncode(input: string): string {
  return input
    .split(' ')
    .map(encodeURIComponent)
    .join('+');
}
