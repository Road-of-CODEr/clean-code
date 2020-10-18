enum ErrorCode {
  OK, INVALID_ARGUMENT_FORMAT, UNEXPECTED_ARGUMENT, INVALID_ARGUMENT_NAME, 
  MISSING_STRING, MISSING_INTEGER, INVALID_INTEGER, MISSING_DOUBLE, INVALID_DOUBLE
}

class Args {
  #schema: string;
  #args: string[];
  #valid: boolean = true;
  #unexpectedArguments: Set<string> = new Set();
  #booleanArgs: Map<string, boolean> = new Map();
  #stringArgs: Map<string, string> = new Map();
  #intArgs: Map<string, number> = new Map();
  #argsFound: Set<string> = new Set();
  #currentArgument: number;
  #errorArgumentId: string = '\0';
  #errorParameter: string = 'TITLT';
  #errorCode: ErrorCode = ErrorCode.OK;

  constructor(schema: string, args: string[]) {
    this.#schema = schema;
    this.#args = args;
    this.#valid = this.parse();
  }

  private parse(): boolean {
    if(this.#schema.length === 0 && this.#args.length === 0) return true;
    this.parseSchema();
    try {
      this.parseArguments();
    } catch(e) {}
    return this.#valid;
  }

  private parseSchema(): boolean {
    this.#schema.split(',').forEach((element) => {
      if(element.length > 0) {
        const trimmedElement: string = element.trim();
        this.parseSchemaElement(trimmedElement);
      };
    });
    return true;
  }

  private parseSchemaElement(element: string): void {
    const elementId = element[0];
    const elementTail: string = element.substring(1);
    this.validateSchemaElementId(elementId);

    if(this.isBooleanSchemaElement(elementTail)) this.parseBooleanSchemaElement(elementId);
    else if(this.isStringSchemaElement(elementTail)) this.parseStringSchemaElement(elementId);
    else if(this.isIntegerSchemaElement(elementTail)) this.parseIntegerSchemaElement(elementId);
    else throw new Error(`Argument: ${elementId} has invalid format: ${elementTail}.`)
  }

  private validateSchemaElementId(elementId: string) {
    if(elementId.length !== 1 || !/[a-zA-Z]/.test(elementId)) {
      throw new Error(`Bad character: ${elementId} in Args format: ${this.#schema}`);
    }
  }

  private parseBooleanSchemaElement(elementId: string) {
    this.#booleanArgs.set(elementId, false);
  }

  private parseStringSchemaElement(elementId: string) {
    this.#stringArgs.set(elementId, '');
  }

  private parseIntegerSchemaElement(elementId: string) {
    this.#intArgs.set(elementId, 0);
  }

  private isStringSchemaElement(elementTail: string): boolean {
    return elementTail === '*';
  }

  private isBooleanSchemaElement(elementTail: string): boolean {
    return elementTail.length === 0;
  }

  private isIntegerSchemaElement(elementTail: string): boolean {
    return elementTail === '#';
  }
  
  private parseArguments() {
    for(this.#currentArgument = 0; this.#currentArgument < this.#args.length; this.#currentArgument++) {
      const arg: string = this.#args[this.#currentArgument];
      this.parseArgument(arg);
    }
    return true;
  }

  private parseArgument(arg: string) {
    if(arg[0] === '-') this.parseElements(arg);
  }

  private parseElements(arg: string) {
    for(let i = 1; i < arg.length; i++) this.parseElement(arg[i]);
  }

  private parseElement(argChar: string) {
    if(this.setArgument(argChar)) this.#argsFound.add(argChar);
    else {
      this.#unexpectedArguments.add(argChar);
      this.#errorCode = ErrorCode.UNEXPECTED_ARGUMENT;
      this.#valid = false;
    }
  }

  private setArgument(argChar: string): boolean {
    if(this.isBooleanArg(argChar)) this.setBooleanArg(argChar, true);
    else if(this.isStringArg(argChar)) this.setStringArg(argChar);
    else if(this.isIntArg(argChar)) this.setIntArg(argChar);
    else return false;

    return true;
  }

  private isIntArg(argChar: string): boolean {
    return this.#intArgs.has(argChar);
  }

  private setIntArg(argChar: string) {
    this.#currentArgument++;
    let parameter: string;
    try {
      parameter = this.#args[this.#currentArgument];
      this.#intArgs.set(argChar, Number(parameter));
    } catch(e) {
      this.#valid = false;
      this.#errorArgumentId = argChar;
      this.#errorParameter = parameter;
      this.#errorCode = ErrorCode.MISSING_INTEGER;
      throw new Args.ArgsException();
    }
  }
  
  private setStringArg(argChar: string) {
    this.#currentArgument++;
    const stringValue: string = this.#args[this.#currentArgument];
    this.#stringArgs.set(argChar, stringValue);
  }

  private isStringArg(argChar: string): boolean {
    return this.#stringArgs.has(argChar);
  }

  private setBooleanArg(argChar: string, value: boolean) {
    this.#booleanArgs.set(argChar, value);
  }

  private isBooleanArg(argChar: string): boolean {
    return this.#booleanArgs.has(argChar);
  }

  public errorMessage(): string {
    switch(this.#errorCode) {
      case ErrorCode.OK:
        throw new Error("TILT: Should not get here.");
      case ErrorCode.UNEXPECTED_ARGUMENT:
        return this.unexpectedArgumentMessage();
      case ErrorCode.MISSING_STRING:
        return `Could not find string parameter for -${this.#errorArgumentId}.`;
      case ErrorCode.INVALID_INTEGER:
        return `Argument -${this.#errorArgumentId} expects an integer but was '${this.#errorParameter}'.`;
      case ErrorCode.MISSING_INTEGER:
        return `Could not find integer parameter for -${this.#errorArgumentId}.`;
    }
    return '';
  }

  private unexpectedArgumentMessage(): string {
    let message = `Argument(s) -`;
    for(const c of this.#unexpectedArguments) message += c;
    message += " unexpected.";
    
    return message.toString();
  }

  static ArgsException = class extends Error {};

  public getString(arg: string): string {
    return this.#stringArgs.get(arg);
  }

  public getBoolean(arg: string): boolean {
    return this.#booleanArgs.get(arg);
  }

  public getInt(arg: string): number {
    return this.#intArgs.get(arg);
  }
}

export default Args;