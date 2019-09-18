function sentencenize(text: string): string[] {
  const SENTENCE_END = /([.?!]+)\s*(?=[A-ZА-ЯЁ])/g;
  const PARAGRAPH_END = /[\n\v\f\r\x85\u2028\u2029]+/;
  return text
    .replace(SENTENCE_END, '$1\n')
    .split(PARAGRAPH_END)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length);
}

function tokenize(text: string): string[] {
  const RE = /[^a-zа-яё0-9]/gi;
  return text
    .replace(RE, ' ')
    .split(/\s+/)
    .filter(token => token.length);
}

export { sentencenize, tokenize };