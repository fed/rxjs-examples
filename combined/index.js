import { Observable } from 'rxjs/Rx';

// UI
const input = document.querySelector('#text');

// Streams
const input$ = Observable
    .fromEvent(input, 'input') // input event
    .map(event => event.target.value);
const timer$ = Observable
    .interval(1000);

input$
    .combineLatest(
        input$,
        timer$,
        (text, timer) => ({ text, timer: timer / 1000, isCool: true })
    )
    .subscribe((value) => console.log(value));

