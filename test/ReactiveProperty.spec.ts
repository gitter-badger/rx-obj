'use strict';

import { expect } from 'chai';
import { Observable, Subject } from 'rxjs';

import { ReactiveProperty, ReactiveOutputProperty } from '../src/ReactiveProperty';

describe('ReactiveProperty', () => {
  it('can create a property without an initial value', () => {
    let prop = new ReactiveProperty();

    expect(prop).to.be.not.null;
  });

  it('can create a property with an initial value', () => {
    let prop = new ReactiveProperty('test');

    expect(prop).to.be.not.null;
    expect(prop.value).to.equal('test');
  });

  it('can set a new value', () => {
    let prop = new ReactiveProperty();
    prop.value = 'test';

    expect(prop.value).to.equal('test');
  });

  it('can return a changing observable', () => {
    let prop = new ReactiveProperty();

    expect(prop.changing).to.be.not.null;
  });

  it('can return a changed observable', () => {
    let prop = new ReactiveProperty();

    expect(prop.changed).to.be.not.null;
  });

  it('can emit a change before it is written', (done) => {
    let prop = new ReactiveProperty('test1');

    let sub = prop.changing.subscribe(x => {
      expect(x).to.equal('test2');
      expect(prop.value).to.equal('test1');

      sub.unsubscribe();

      done();
    });

    prop.value = 'test2';
  });

  it('can emit a change after it is written', (done) => {
    let prop = new ReactiveProperty('test1');

    let sub = prop.changed.subscribe(x => {
      expect(x).to.equal('test2');
      expect(prop.value).to.equal('test2');

      sub.unsubscribe();

      done();
    });

    prop.value = 'test2';
  });
});

describe('ReactiveOutputProperty', () => {
  it('can create an output property without an initial value', () => {
    let source = Observable.of('test');
    let prop = new ReactiveOutputProperty(source);

    expect(prop).to.be.not.null;
    expect(prop.value).to.equal('test');

    prop.unsubscribe();
  });

  it('can create an output property with an initial value', () => {
    let source = Observable.never();
    let prop = new ReactiveOutputProperty(source, 'test');

    expect(prop).to.be.not.null;
    expect(prop.value).to.equal('test');

    prop.unsubscribe();
  });

  it('fails setting a new value', () => {
    let source = Observable.never();
    let prop = new ReactiveOutputProperty(source);

    expect(() => prop.value = 'test').to.throw();

    prop.unsubscribe();
  });

  it('can return a changing observable', () => {
    let source = Observable.never();
    let prop = new ReactiveOutputProperty(source);

    expect(prop.changing).to.be.not.null;

    prop.unsubscribe();
  });

  it('can return a changed observable', () => {
    let source = Observable.never();
    let prop = new ReactiveOutputProperty(source);

    expect(prop.changed).to.be.not.null;

    prop.unsubscribe();
  });

  it('can connect to the source', () => {
    let source = Observable.never();
    let prop = new ReactiveOutputProperty(source);

    let sub = prop.connect();

    expect(sub).to.be.not.null;
    expect(sub.isUnsubscribed).to.be.false;

    prop.unsubscribe();
  });

  it('will connect to the source only once', () => {
    let source = Observable.never();
    let prop = new ReactiveOutputProperty(source);

    let sub1 = prop.connect();
    let sub2 = prop.connect();

    expect(sub1).to.equal(sub2);

    prop.unsubscribe();
  });

  it('can unsubscribe from the source', () => {
    let source = Observable.never();
    let prop = new ReactiveOutputProperty(source);

    let sub = prop.connect();

    prop.unsubscribe();

    expect(sub.isUnsubscribed).to.be.true;
  });

  it('can emit a change before it is written', (done) => {
    let source = new Subject();
    let prop = new ReactiveOutputProperty(source);

    // force connection
    prop.connect();

    source.next('test1');

    let sub = prop.changing.subscribe(x => {
      expect(x).to.equal('test2');
      expect(prop.value).to.equal('test1');

      sub.unsubscribe();
      prop.unsubscribe();

      done();
    });

    source.next('test2');
  });

  it('can emit a change after it is written', (done) => {
    let source = new Subject();
    let prop = new ReactiveOutputProperty(source);

    // force connection
    prop.connect();

    source.next('test1');

    let sub = prop.changed.subscribe(x => {
      expect(x).to.equal('test2');
      expect(prop.value).to.equal('test2');

      sub.unsubscribe();
      prop.unsubscribe();

      done();
    });

    source.next('test2');
  });

  it('can handle errors in the source stream using thrownErrors', (done) => {
    let source = new Subject();
    let prop = new ReactiveOutputProperty(source);

    // force connection
    prop.connect();

    let sub = prop.thrownErrors.subscribe(x => {
      expect(x).to.equal('error');

      sub.unsubscribe();
      prop.unsubscribe();

      done();
    });

    source.error('error');
  });

  it('can handle errors in the source stream using catchErrors', (done) => {
    let source = new Subject();
    let prop = new ReactiveOutputProperty(source)
      .catchErrors(x => {
        expect(x).to.equal('error');

        prop.unsubscribe();

        done();
      });

    // force connection
    prop.connect();

    source.error('error');
  });

  it('can unsubscribe from the catchErrors subscription', () => {
    let source = Observable.never();
    let prop = new ReactiveOutputProperty(source)
      .catchErrors(x => {});

    let sub = prop.connect();

    prop.unsubscribe();

    expect(sub.isUnsubscribed).to.be.true;
  });

  it('can handle uncaught errors', () => {
    let source = new Subject();
    let prop = new ReactiveOutputProperty(source);

    // force connection
    prop.connect();

    expect(() => source.error('error')).to.not.throw();
  });
});
