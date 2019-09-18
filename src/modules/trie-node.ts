type TrieNodeTuple = [string, boolean, any[]];

class TrieNode {
  public static deserialize(nodes: TrieNodeTuple[]): TrieNode {
    const updateNode = ((parentNode, serialNode) => {
      const childNode = new TrieNode();
      if (serialNode[1]) {
        childNode.setEnd();
      }
      parentNode.set(serialNode[0], childNode);
      if (serialNode[2] && serialNode[2].length) {
        serialNode[2].forEach((childSerial) => updateNode(childNode, childSerial));
      }
    });
    const node = new TrieNode();
    nodes.forEach((serialNode) => updateNode(node, serialNode));
    return node;
  }

  private _keys: Map<string, TrieNode>;
  private _end: boolean;

  constructor() {
    this._keys = new Map();
    this._end = false;
  }

  get end() {
    return this._end;
  }

  get size(): number {
    return this._keys.size;
  }

  get keys(): IterableIterator<string> {
    return this._keys.keys();
  }

  public has(key: string): boolean {
    return this._keys.has(key);
  }

  public get(key: string): TrieNode {
    return this._keys.get(key);
  }

  public set(key: string, node: TrieNode): void {
    this._keys.set(key, node);
  }

  public setEnd(): void {
    this._end = true;
  }

  public serialize(): TrieNodeTuple[] {
    const nodes: TrieNodeTuple[] = [];
    this._keys.forEach((value, key) => nodes.push([key, value.end, value.serialize()]));
    return nodes;
  }
}

export { TrieNode };
