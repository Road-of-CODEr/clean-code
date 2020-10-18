import ArgumentIterator from "../ArgumentIterator";
import { ArgumentMarshaler } from "./ArgumentMarshaler";

class BooleanArgumentMarshaler implements ArgumentMarshaler {
  #booleanValue = false;

  public set(currentArgument: ArgumentIterator) {
    this.#booleanValue = true;
  }

  public static getValue(am: ArgumentMarshaler) {
    if(am instanceof BooleanArgumentMarshaler) return am.#booleanValue;
    else return false;
  }
}

export default BooleanArgumentMarshaler;