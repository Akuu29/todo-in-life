export {};

declare global {
  interface CustomObject<T> {
    [key: string]: T;
  }

  type ErrorMessages = CustomObject<Array<string>>;

  type FnToHandleTodosTable = () => Promise<void>;

  interface ValidationError {
    code: string;
    message: string;
    params: Object;
  }

  type ValidationErrors = CustomObject<Array<ValidationError>>;
}