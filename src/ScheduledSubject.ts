'use strict';

import { Observer, Subject, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

export class ScheduledSubject<T> extends Subscription {
  protected subject: Subject<T> = null;
  protected defaultObserverSub: Subscription = null;

  constructor(protected scheduler: Scheduler, protected defaultObserver?: Observer<T>, defaultSubject?: Subject<T>) {
    super();

    this.subject = defaultSubject || new Subject<T>();

    if (this.defaultObserver != null) {
      this.defaultObserverSub = this.subject
        .observeOn(this.scheduler)
        .subscribe(defaultObserver);
    }
  }

  unsubscribe() {
    if (this.subject.isUnsubscribed === false) {
      this.subject.unsubscribe();
    }
  }
}
