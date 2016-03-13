'use strict';

if (DEBUG) {
  console.log('*** DEBUG BUILD ***');
}

import * as Interfaces from './Interfaces';
import * as Extensions from './Extensions';

import ReactiveObject from './ReactiveObject';
import { ReactiveProperty, ReactiveOutputProperty} from './ReactiveProperty';

export {
  Interfaces,
  Extensions,
  ReactiveObject,
  ReactiveProperty, ReactiveOutputProperty
};
