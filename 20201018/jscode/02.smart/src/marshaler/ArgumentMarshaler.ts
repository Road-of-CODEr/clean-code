import ArgumentIterator from "../ArgumentIterator";

export interface ArgumentMarshaler {
  set(currentArgument: ArgumentIterator): void
};
