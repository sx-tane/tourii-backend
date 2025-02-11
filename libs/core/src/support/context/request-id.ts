import { v4 as uuid } from 'uuid';

export class RequestId {
  private _value: string;

  constructor();
  constructor(value: string);
  constructor(value?: string) {
    if (value) {
      this._value = value;
    } else {
      this._value = uuid();
    }
  }

  get value() {
    return this._value;
  }
}
