'use strict';

import { Observable, ConnectableObservable, Subject, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

import { IReactiveProperty, IReactiveOutputProperty } from './Interfaces';
import { ScheduledSubject } from './ScheduledSubject';

export class ReactiveProperty<T> implements IReactiveProperty<T> {
  protected currentValue: T = null;
  protected changingSubject: Subject<T> = null;
  protected changedSubject: Subject<T> = null;

  constructor(initialValue?: T, scheduler?: Scheduler) {
    this.currentValue = initialValue;
  }

  protected onValueChanged(newValue: T) {
    if (this.currentValue !== newValue) {
      if (this.changingSubject != null) {
        this.changingSubject.next(newValue);
      }

      this.currentValue = newValue;

      if (this.changedSubject != null) {
        this.changedSubject.next(newValue);
      }
    }
  }

  get value() {
    return this.currentValue;
  }

  set value(value: T) {
    this.onValueChanged(value);
  }

  get changing() {
    if (this.changingSubject == null) {
      this.changingSubject = new Subject<T>();
    }

    return this.changingSubject
      .asObservable();
  }

  get changed() {
    if (this.changedSubject == null) {
      this.changedSubject = new Subject<T>();
    }

    return this.changedSubject
      .asObservable();
  }
}

export class ReactiveOutputProperty<T> extends ReactiveProperty<T> implements IReactiveOutputProperty<T> {
  protected sourceObservable: ConnectableObservable<T> = null;
  protected sourceSubject: Subject<T> = null;
  protected sourceSubscription: Subscription = null;
  protected thrownErrorsSubject: Subject<any> = null;

  constructor(source: Observable<T>, initialValue?: T, scheduler?: Scheduler) {
    super(initialValue);

    if (source == null) {
      throw new Error('Invalid Source Observable');
    }

    this.sourceSubject = new Subject<T>();

    this.sourceSubject.subscribe(
      x => {
        this.onValueChanged(x);
      }, x => {
        this.onError(x);
      }
    );

    this.sourceObservable = source
      .startWith(initialValue)
      .distinctUntilChanged()
      .multicast(this.sourceSubject);
  }

  protected onError(error: any) {
    if (this.thrownErrorsSubject == null) {
      if (DEBUG) {
        // TODO: abstract logging
        console.log('Uncaught Error');
        console.log(error);
      }
    } else {
      this.thrownErrorsSubject.next(error);
    }
  }

  get value() {
    this.connect();

    return this.currentValue;
  }

  set value(_: any) {
    throw new Error('Property is Read Only');
  }

  get source() {
    return this.sourceSubject
      .asObservable();
  }

  get thrownErrors() {
    if (this.thrownErrorsSubject == null) {
      this.thrownErrorsSubject = new Subject<any>();
    }

    return this.thrownErrorsSubject;
  }

  connect() {
    if (this.sourceSubscription == null) {
      this.sourceSubscription = this.sourceObservable.connect();
    }

    return this.sourceSubscription;
  }

  catchErrors(errorHandler: (error: any) => void) {
    let sub = this.thrownErrors
      .subscribe(errorHandler);

    this.connect().add(sub);

    return this;
  }

  unsubscribe() {
    if (this.sourceSubscription != null) {
      this.sourceSubscription.unsubscribe();

      this.sourceSubscription = null;
    }
  }
}
