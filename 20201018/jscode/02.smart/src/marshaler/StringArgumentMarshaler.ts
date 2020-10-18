import ArgsException from "../ArgsException";
import ArgumentIterator from "../ArgumentIterator";
import { ArgumentMarshaler } from "./ArgumentMarshaler";

class StringArgumentMarshaler implements ArgumentMarshaler {
  #stringValue = '';

  public set(currentArgument: ArgumentIterator) {
    const stringValue = currentArgument.next();
    if(stringValue.value === undefined || stringValue.done) {
      throw new ArgsException({ errorCode: ArgsException.ErrorCode.MISSING_STRING });
    }
    this.#stringValue = stringValue.value;
  };

  public static getValue(am: ArgumentMarshaler) {
    if(am instanceof StringArgumentMarshaler) return am.#stringValue;
    else return '';
  }
}

export default StringArgumentMarshaler;