'use strict';

import './Extensions';

import { Subject, BehaviorSubject, Subscription } from 'rxjs';

import { IReactiveObject, IReactivePropertyChangedEventArgs } from './Interfaces';

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
};

export default ReactiveObject;
