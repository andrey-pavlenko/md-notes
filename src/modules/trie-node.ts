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

  private xKeys: Map<string, TrieNode>;
  private xEnd: boolean;

  constructor() {
    this.xKeys = new Map();
    this.xEnd = false;
  }

  get end() {
    return this.xEnd;
  }

  get size(): number {
    return this.xKeys.size;
  }

  get keys(): IterableIterator<string> {
    return this.xKeys.keys();
  }

  public has(key: string): boolean {
    return this.xKeys.has(key);
  }

  public get(key: string): TrieNode {
    return this.xKeys.get(key);
  }

  public set(key: string, node: TrieNode): void {
    this.xKeys.set(key, node);
  }

  public setEnd(): void {
    this.xEnd = true;
  }

  public serialize(): TrieNodeTuple[] {
    const nodes: TrieNodeTuple[] = [];
    this.xKeys.forEach((value, key) => nodes.push([key, value.end, value.serialize()]));
    return nodes;
  }
}

export { TrieNode };
