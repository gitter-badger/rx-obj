'use strict';

import { expect } from 'chai';

import * as Rx from 'rxjs';

describe('Sanity Tests', () => {
  describe('for mocha', () => {
    it('can create tests with describe and it', () => {
    });
  });

  describe('for chai', () => {
    it('can expect assertions', () => {
      expect(true).to.be.true;
    });
  });

  describe('for RxJS', () => {
    it('can load the Rx module', () => {
      expect(Rx).to.be.not.null;
    });

    it('can create an observable', () => {
      const obs = Rx.Observable.of(true);

      expect(obs).to.be.not.null;
      expect(obs).to.be.instanceOf(Rx.Observable);
    });

    it('can produce observable results', () => {
      const obs = Rx.Observable.of(true);
      let count = 0;

      obs.subscribe(() => ++count, null, () => {
        expect(count).to.equal(1);
      });

      return obs.toPromise();
    });
  });
});
