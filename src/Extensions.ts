'use strict';

// import { Observable } from 'rxjs';
// import { ObservableInput } from 'rxjs/Observable';

// export function toProperty(): void {
// }

// Observable.prototype.toProperty = toProperty;

// export function whenAny<TRet>(...args: any[]) {
//   let selector: ((...values: any[]) => TRet) = args.pop();
//   let observables: ObservableInput<any>[] = args;
//   return Observable.combineLatest(observables, selector);
// }

// Object.prototype.whenAny = whenAny;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    toProperty(): void;
  }
};
