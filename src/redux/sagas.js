import { fork } from 'redux-saga/effects';

export default function* () {
  yield [].map((watcher) => fork(watcher));
}
