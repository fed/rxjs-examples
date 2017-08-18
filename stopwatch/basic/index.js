import {Observable} from 'rxjs/Rx';

const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');

const start$ = Observable.fromEvent(startButton, 'click');
const stop$ = Observable.fromEvent(stopButton, 'click');
const interval$ = Observable.interval(500);

// One way, using takeUntil
start$
    .switchMapTo(interval$)
    .takeUntil(stop$)
    .subscribe((value) => {
        console.log(value)
    });

// Another way, using unsubscribe()
const subscription = start$
    .switchMapTo(interval$)
    .subscribe((value) => {
        console.log(value)
    });

stop$.subscribe(() => {
    subscription.unsubscribe()
});
