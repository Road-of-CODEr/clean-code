import ArgsException from "../ArgsException";
import ArgumentIterator from "../ArgumentIterator";
import { ArgumentMarshaler } from "./ArgumentMarshaler";

class IntegerArgumentMarshaler implements ArgumentMarshaler {
  #intValue = 0;

  public set(currentArgument: ArgumentIterator) {
    const parameter = currentArgument.next();

    if(parameter.value === undefined || parameter.done) throw new ArgsException({ errorCode: ArgsException.ErrorCode.MISSING_STRING });
    else if(isNaN(Number(parameter.value))) {
      throw new ArgsException({
        errorCode: ArgsException.ErrorCode.INVALID_INTEGER,
        errorParameter: parameter.value
      });
    }

    this.#intValue = Number(parameter.value);
  };

  public static getValue(am: ArgumentMarshaler): number {
    if(am instanceof IntegerArgumentMarshaler) return am.#intValue;
    else return 0;
  }
}

export default IntegerArgumentMarshaler;