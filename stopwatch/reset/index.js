import { Observable } from 'rxjs/Rx';

// UI
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const resetButton = document.querySelector('#reset');

// Functions
const initialData = { count: 0 };
const increment = (current) => ({ count: current.count + 1 });
const reset = () => initialData;

// Streams
const stop$ = Observable
    .fromEvent(stopButton, 'click');

const reset$ = Observable
    .fromEvent(resetButton, 'click');

const interval$ = Observable
    .interval(500)
    .takeUntil(stop$);

const incrementOrReset$ = Observable.merge(
    interval$.mapTo(increment),
    reset$.mapTo(reset)
);

const start$ = Observable
    .fromEvent(startButton, 'click')
    .switchMapTo(incrementOrReset$)
    .startWith(initialData)
    .scan((accumulator, current) => current(accumulator))
    .subscribe((data) => {
        console.log(data.count)
    });
