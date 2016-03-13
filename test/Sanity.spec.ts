'use strict';

import { expect } from 'chai';

import * as Rx from 'rxjs';

describe('Sanity Tests', () => {
  describe('for Mocha', () => {
    it('should assert properly', () => {
      expect(true).to.be.true;
    });
  });

  describe('for RxJS 5', () => {
    it('can load Rx', () => {
      expect(Rx).to.be.not.null;
    });
    it('can create an observable', () => {
      let obs = Rx.Observable.of(true);
      let count = 0;
      obs.subscribe(() => ++count, null, () => {
        expect(count).to.equal(1);
      });
      return obs.toPromise();
    });
  });
});
