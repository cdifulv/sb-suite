export default function trimWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}
