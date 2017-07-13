import {Observable} from 'rxjs/Rx';

const button = document.querySelector('.btn');

const click$ = Observable.fromEvent(button, 'click');
const doubleClick$ = click$
    .bufferWhen(() => click$.debounceTime(250))
    .map(clicks => clicks.length)
    .filter(length => length === 2);

doubleClick$.subscribe(() => {
    button.textContent = 'Yay! You have just double-clicked me :)';
    button.disabled = true;
});
