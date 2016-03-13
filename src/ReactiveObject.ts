'use strict';

import './Extensions';

import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

import { IReactiveObject, IReactiveProperty, IReactiveCommand, IReactivePropertyChangedEventArgs } from './Interfaces';
import { ReactiveProperty } from './ReactiveProperty';

export class ReactiveObject extends Object implements IReactiveObject {
  private changingSubject = new Subject<IReactivePropertyChangedEventArgs<IReactiveObject>>();
  private changedSubject = new Subject<IReactivePropertyChangedEventArgs<IReactiveObject>>();
  private notificationsEnabledSubject = new BehaviorSubject<boolean>(true);

  get changing() {
    return this.changingSubject
      .asObservable();
  }

  get changed() {
    return this.changedSubject
      .asObservable();
  }

  suppressChangeNotifications() {
    let sub = new Subscription();
    let x: Object;
    return sub;
  }

  property<T>(initialValue?: T, scheduler?: Scheduler): IReactiveProperty<T> {
    let prop = new ReactiveProperty(initialValue);

    return prop;
  }

  command<TRet, TParam>(execute: (x: TParam) => Observable<TRet>, canExecute: Observable<boolean>): IReactiveCommand<TRet> {
    let cmd: IReactiveCommand<TRet> = null;

    return cmd;
  }
};

export default ReactiveObject;
