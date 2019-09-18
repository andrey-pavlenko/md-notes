import { TrieNode } from './trie-node';

class Trie {
  public static deserialize(data: any[]): Trie {
    return new Trie(TrieNode.deserialize(data));
  }

  protected xRoot: TrieNode;

  constructor(root?: TrieNode) {
    if (root) {
      this.xRoot = root;
    } else {
      this.xRoot = new TrieNode();
    }
  }

  public serialize(): any[] {
    return this.xRoot.serialize();
  }

  public add(input: string, node: TrieNode= this.xRoot): void {
    if (input.length === 0) {
      node.setEnd();
      return;
    } else if (!node.has(input[0])) {
      node.set(input[0], new TrieNode());
      return this.add(input.substr(1), node.get(input[0]));
    } else {
      return this.add(input.substr(1), node.get(input[0]));
    }
  }

  public isWord(word: string): boolean {
    let node = this.xRoot;
    while (word.length > 1) {
      if (!node.has(word[0])) {
        return false;
      } else {
        node = node.get(word[0]);
        word = word.substr(1);
      }
    }
    return node.has(word) && node.get(word).end;
  }

  public print(): string[] {
    const words = [];
    const search = (input: string, node: TrieNode= this.xRoot) => {
      node = node || this.xRoot;
      if (node.size !== 0) {
        for (const letter of node.keys) {
          search(input.concat(letter), node.get(letter));
        }
        if (node.end) {
          words.push(input);
        }
      } else {
        if (input.length > 0) {
          words.push(input);
        }
      }
    };
    search('');
    return words;
  }
}

export { Trie };
