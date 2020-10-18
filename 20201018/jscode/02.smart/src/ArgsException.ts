interface Constructor {
  message?: string;
  errorCode?: ErrorCode;
  errorParameter?: string;
  errorArgumentId?: string;
}

enum ErrorCode {
  OK, INVALID_ARGUMENT_FORMAT, UNEXPECTED_ARGUMENT, INVALID_ARGUMENT_NAME, 
  MISSING_STRING, MISSING_INTEGER, INVALID_INTEGER, MISSING_DOUBLE, INVALID_DOUBLE
}

class ArgsException extends Error {
  public static readonly ErrorCode = ErrorCode;
  #errorCode: ErrorCode;
  #errorParameter: string;
  #errorArgumentId: string;

  constructor({ message, errorCode, errorParameter, errorArgumentId = '\0' }: Constructor) {
    super(message);
    this.#errorCode = errorCode;
    this.#errorParameter = errorParameter;
    this.#errorArgumentId = errorArgumentId;
  }

  public getErrorArgumentId(): string {
    return this.#errorArgumentId;
  }

  public setErrorArgumentId(errorArgumentId: string) {
    this.#errorArgumentId = errorArgumentId;
  }

  public getErrorParameter(): string {
    return this.#errorParameter;
  }

  public setErrorParameter(errorParameter: string) {
    this.#errorParameter = errorParameter;
  }

  public getErrorCode(): ErrorCode {
    return this.#errorCode;
  }

  public setErrorCode(errorCode: ErrorCode) {
    this.#errorCode = errorCode;
  }

  public errorMessage(): string {
    switch(this.#errorCode) {
      case ErrorCode.OK:
        return "TILT: Should not get here.";
      case ErrorCode.UNEXPECTED_ARGUMENT:
        return `Argument -${this.#errorArgumentId} unexpected.`;
      case ErrorCode.MISSING_STRING:
        return `Could not find string parameter for -${this.#errorArgumentId}.`;
      case ErrorCode.INVALID_INTEGER:
        return `Argument -${this.#errorArgumentId} expects an integer but was '${this.#errorParameter}'.`;
      case ErrorCode.MISSING_INTEGER:
        return `Could not find integer parameter for -${this.#errorArgumentId}.`;
      case ErrorCode.INVALID_DOUBLE:
        return `Argument -${this.#errorArgumentId} expects a double but was '${this.#errorParameter}'.`;
      case ErrorCode.MISSING_DOUBLE:
        return `Could not find double parameter for -${this.#errorArgumentId}.`; 
      case ErrorCode.INVALID_ARGUMENT_NAME:
        return `'${this.#errorArgumentId}' is not a valid argument name.`;
      case ErrorCode.INVALID_ARGUMENT_FORMAT:
        return `'${this.#errorParameter}' is not a valid argument format.`;
      default:
        return '';
    }
  }
}

export default ArgsException;