import { ArgumentMarshaler } from './marshaler/ArgumentMarshaler';
import ArgsException from './ArgsException';
import BooleanArgumentMarshaler from './marshaler/BooleanArgumentMarshaler';
import StringArgumentMarshaler from './marshaler/StringArgumentMarshaler';
import IntegerArgumentMarshaler from './marshaler/IntegerArgumentMarshaler';
import ArgumentIterator from './ArgumentIterator';

class Args {
  #marshalers: Map<string, ArgumentMarshaler>;
  #argsFound: Set<string>;
  #currentArguments: ArgumentIterator;

  constructor(schema: string, args: string[]) {
    this.#marshalers = new Map();
    this.#argsFound = new Set();

    this.parseSchema(schema);
    this.parseArgumentStrings(args);
  }

  private parseSchema(schema: string): void {
    schema.split(',').forEach((element) => {
      if(element.length > 0) {
        this.parseSchemaElement(element.trim());
      };
    });
  }

  private parseSchemaElement(element: string): void {
    const elementId = element[0];
    const elementTail: string = element.substring(1);
    this.validateSchemaElementId(elementId);
    
    let marshaler: ArgumentMarshaler;
    if(elementTail.length === 0) {
      marshaler = new BooleanArgumentMarshaler();
    } else if(elementTail === '*') {
      marshaler = new StringArgumentMarshaler();
    } else if(elementTail === '#') {
      marshaler = new IntegerArgumentMarshaler();
    } else {
      throw new ArgsException({ 
        errorCode: ArgsException.ErrorCode.INVALID_ARGUMENT_NAME,
        errorArgumentId: elementId,
        errorParameter: undefined,
      });
    }
    this.#marshalers.set(elementId, marshaler);
  }

  private validateSchemaElementId(elementId: string): void {
    if(elementId.length !== 1 || !/[a-zA-Z]/.test(elementId)) {
      throw new ArgsException({ 
        errorCode: ArgsException.ErrorCode.INVALID_ARGUMENT_NAME,
        errorArgumentId: elementId,
        errorParameter: undefined,
      });
    }
  }
  
  private parseArgumentStrings(argsList: string[]) {
    this.#currentArguments = new ArgumentIterator(argsList);

    for(;this.#currentArguments.hasNext();) {
      const argString = this.#currentArguments.next().value;

      if(!argString || argString[0] !== '-') {
        this.#currentArguments.previous();
        break;
      }

      this.parseArgumentCharacters(argString.substring(1));
    }
  }

  private parseArgumentCharacters(argChars: string) {
    Array.from(argChars).forEach(this.parseArgumentCharacter.bind(this)); // p, pld, d, ...
  }

  private parseArgumentCharacter(argChar: string) { // p, d, l, ...
    const m: ArgumentMarshaler = this.#marshalers.get(argChar);

    if(!m) {
      throw new ArgsException({
        errorCode: ArgsException.ErrorCode.UNEXPECTED_ARGUMENT,
        errorArgumentId: argChar,
        errorParameter: undefined,
      });
    } else {
      this.#argsFound.add(argChar);

      try {
        m.set(this.#currentArguments);
      } catch(e) {
        if(e instanceof ArgsException) e.setErrorArgumentId(argChar);
        throw e;
      }
    }
  }

  public has(arg: string): boolean { 
    return this.#argsFound.has(arg);
  }
  
  public getBoolean(arg: string): boolean {
    return BooleanArgumentMarshaler.getValue(this.#marshalers.get(arg));
  }
  
  public getString(arg: string): string {
    return StringArgumentMarshaler.getValue(this.#marshalers.get(arg));
  }
  
  public getInt(arg: string): number {
    return IntegerArgumentMarshaler.getValue(this.#marshalers.get(arg));
  }
}

export default Args;