const DEFAULT_INDENT = ' '.repeat(2);

export class FileBuilder {
  private readonly indent: string;
  private readonly b: string[];
  indentCount: number;

  constructor(indent = DEFAULT_INDENT, header = true) {
    this.indent = indent;
    this.b = [];
    this.indentCount = 0;

    if (header) {
      this.appendNoWrap('/*');
      this.appendNoWrap(' * This is a generated file');
      this.appendNoWrap(' * Do not edit manually.');
      this.appendNoWrap(' */');
      this.newLine();
    }
  }

  newLine(): void {
    this.b.push('\n');
  }

  appendNoWrap(line: string): void {
    this.b.push(this.indent.repeat(this.indentCount));
    this.b.push(line);
    this.b.push('\n');
  }

  append(line: string): void {
    const nowrap = this.indent.repeat(this.indentCount) + line;
    if (nowrap.length < 160) {
      this.b.push(nowrap);
      this.b.push('\n');
    } else {
      let first = true;
      for (const wrappedLine of wordWrap(nowrap, 120 - this.indent.length * this.indentCount)) {
        if (first) {
          this.b.push(this.indent.repeat(this.indentCount));
        } else {
          this.b.push(this.indent.repeat(this.indentCount + 2));
        }
        this.b.push(wrappedLine.trim());
        this.b.push('\n');
        first = false;
      }
    }
  }

  toString(): string {
    return this.b.join('').replaceAll('\n\n\n', '\n\n');
  }
}

/**
 * Returns a word-wrapped string.
 * Based on: https://stackoverflow.com/a/38709683
 * @param text - Original input string.
 * @param maxLength - Width in number of characters.
 * @returns Array of lines.
 */
export function wordWrap(text: string, maxLength: number): string[] {
  const result = [];
  let line: string[] = [];
  let length = 0;
  text.split(' ').forEach(function (word) {
    if (length + word.length > maxLength) {
      result.push(line.join(' ').trim());
      line = [];
      length = 0;
    }
    length += word.length + 1;
    line.push(word);
  });
  if (line.length > 0) {
    result.push(line.join(' ').trim());
  }
  return result;
}
