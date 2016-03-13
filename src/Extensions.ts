'use strict';

// import { Observable, Scheduler } from 'rxjs';
import { Observable } from 'rxjs';
// import { Scheduler } from 'rxjs/Rx.d.ts';
import { IReactiveObject, IReactiveOutputProperty } from './Interfaces';

// export function toProperty(): void {
// }

// Observable.prototype.toProperty = toProperty;

// export function whenAny<TRet>(...args: any[]) {
//   let selector: ((...values: any[]) => TRet) = args.pop();
//   let observables: ObservableInput<any>[] = args;
//   return Observable.combineLatest(observables, selector);
// }

// Object.prototype.whenAny = whenAny;

// declare module 'rxjs/Observable' {
//   interface Observable<T> {
//     toProperty(): void;
//   }
// };

export class Extensions {
  public static whenAnyValue<TObj extends IReactiveObject, TRet>(...args: any[]) {
    let selector: ((...values: any[]) => TRet) = args.pop();
    let observables: (() => Observable<any>)[] = args;
  }

  public static toProperty<TObj extends IReactiveObject, TRet>(
    $this: Observable<TRet>,
    source: IReactiveObject,
    property: (obj: TObj) => TRet,
    initialValue?: TRet
  ) {
    if ($this == null) {
      throw new Error('Invalid Observable');
    }
  }
}
