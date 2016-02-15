'use strict';

import { Observable } from 'rxjs';

export interface IReactiveObject {
  changing: Observable<IReactivePropertyChangedEventArgs<IReactiveObject>>;
  changed: Observable<IReactivePropertyChangedEventArgs<IReactiveObject>>;
};

export interface IReactivePropertyChangedEventArgs<T> {
  propertyName: string;
  sender: T;
}

export interface IReactiveProperty<T> {
};

export interface IReactiveCommand<T> {
};

export interface IReactiveList<T> {
};
