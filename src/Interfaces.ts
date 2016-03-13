'use strict';

import { Observable, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

export interface IUnsubscribable {
  unsubscribe(): void;
}

export interface IReactiveObject {
  changing: Observable<IReactivePropertyChangedEventArgs<IReactiveObject>>;
  changed: Observable<IReactivePropertyChangedEventArgs<IReactiveObject>>;

  property<T>(initialValue?: T, scheduler?: Scheduler): IReactiveProperty<T>;
  command<TRet, TParam>(execute: (x: TParam) => Observable<TRet>, canExecute: Observable<boolean>, scheduler?: Scheduler): IReactiveCommand<TRet>;
};

export interface IReactivePropertyChangedEventArgs<T> {
  propertyName: string;
  sender: T;
}

export interface IReactiveProperty<T> {
  changing: Observable<T>;
  changed: Observable<T>;
  value: T;
};

export interface IReactiveOutputProperty<T> extends IReactiveProperty<T>, IUnsubscribable {
  source: Observable<T>;
  thrownErrors: Observable<any>;

  connect(): Subscription;
  catchErrors(errorHandler: (error: any) => void): IReactiveOutputProperty<T>;
  unsubscribe(): void;
};

export interface IReactiveCommand<T> {
};

// export interface IReactiveList<T> {
// };
