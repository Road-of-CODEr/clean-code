export interface IteratorObject {
  value: string | undefined,
  done: boolean
};

// class ArgumentIterator implements Iterable<string | undefined> {
  class ArgumentIterator {
  #items: string[];
  #index = -1;

  constructor(items: string[]) {
    this.#items = [...items, undefined];
  }

  hasNext() {
    return this.#index < this.#items.length;
  }

  getValues() {
    return {
      valueList: [...this.#items],
      curIndex: this.#index,
    }
  }

  getCur() {
    return [...this.#items[this.#index]];
  }

  next(): IteratorObject {
    const item = this.#items[this.#index++ + 1];
    if(this.#index >= this.#items.length) this.#index = this.#items.length - 1;
    if (item !== undefined) {
      return {
        value: item,
        done: false
      };
    }
    return { value: undefined, done: true };
  };

  previous(): IteratorObject {
    const item = this.#items[this.#index-- - 1];
    if(this.#index < 0) this.#index = -1;
    if (item !== undefined) {
      return {
        value: item,
        done: false
      };
    }
    return { value: undefined, done: true };
  }
};

export default ArgumentIterator;
