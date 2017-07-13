import {Observable} from 'rxjs/Rx';

const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');

const start$ = Observable.fromEvent(startButton, 'click');
const stop$ = Observable.fromEvent(stopButton, 'click');
const interval$ = Observable.interval(500);

const subscription = start$
    .switchMapTo(interval$)
    .subscribe((value) => {
        console.log(value)
    });

stop$.subscribe(() => {
    subscription.unsubscribe()
});
