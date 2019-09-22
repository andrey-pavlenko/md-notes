import { TrieNode } from './trie-node';

class Trie {
  /**
   * Restore Trie from serialized
   */
  public static deserialize(data: any[]): Trie {
    return new Trie(TrieNode.deserialize(data));
  }

  protected xRoot: TrieNode;

  constructor(root?: TrieNode) {
    if (root instanceof TrieNode) {
      this.xRoot = root;
    } else {
      this.xRoot = new TrieNode();
    }
  }

  /**
   * Serialize Trie to array
   */
  public serialize(): any[] {
    return this.xRoot.serialize();
  }

  public add(input: string | string[]): Trie {
    const add = (str: string, node: TrieNode = this.xRoot): void => {
      if (str.length === 0) {
        node.setEnd();
        return;
      } else if (!node.has(str[0])) {
        node.set(str[0], new TrieNode());
        return add(str.substr(1), node.get(str[0]));
      } else {
        return add(str.substr(1), node.get(str[0]));
      }
    };
    if (Array.isArray(input)) {
      input.forEach((word) => add(word));
    } else {
      add(input);
    }
    return this;
  }

  public clear(): Trie {
    this.xRoot = new TrieNode();
    return this;
  }

  public contains(word: string): boolean {
    const node = this.findPrefix(word);
    return node && node.end;
  }

  get words(): string[] {
    return this.findSuffixes(this.xRoot);
  }

  /**
   * Returns all words starts with prefix
   */
  public match(prefix: string): string[] {
    const node = this.findPrefix(prefix);
    if (node !== null) {
      const suffixes = this.findSuffixes(node);
      return suffixes.length ?
        suffixes.map((suffix) => prefix + suffix) : [prefix];
    }
    return [];
  }

  protected findPrefix(input: string): TrieNode {
    let node = this.xRoot;
    while (input.length > 0) {
      if (!node.has(input[0])) {
        return null;
      } else {
        node = node.get(input[0]);
        input = input.substr(1);
      }
    }
    return node;
  }

  protected findSuffixes(node: TrieNode): string[] {
    const suffixes: string[] = [];
    const search = (subNode: TrieNode, input: string = ''): void => {
      if (subNode.size !== 0) {
        for (const letter of subNode.keys) {
          search(subNode.get(letter), input.concat(letter));
        }
        if (subNode.end) {
          suffixes.push(input);
        }
      } else {
        if (input.length > 0) {
          suffixes.push(input);
        }
      }
     };
    search(node);
    return suffixes;
  }
}

function weigth(token: string, words: string[]): number {
  const tokenLen = token.length;
  if (tokenLen) {
    const wordsWeigth = words
      .filter((word) => word.startsWith(token))
      .map((word) => tokenLen <= word.length ? tokenLen / word.length : 0);
    return wordsWeigth.reduce((acc, tokenWeight) => acc + tokenWeight, 0);
  }
  return 0;
}

export { Trie, weigth };
