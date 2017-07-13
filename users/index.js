import {Observable} from 'rxjs/Rx';

const refreshButton = document.querySelector('.refresh');
const refreshClickStream = Observable.fromEvent(refreshButton, 'click');
const requestOnRefreshStream = refreshClickStream.map(() => {
    const offset = Math.floor(500 * Math.random());

    return `//api.github.com/users?since=${offset}`;
});

const initialRequestStream = Observable.of('//api.github.com/users');
const fetchPromise = (url) => fetch(url).then(response => response.json());
const responseStream = initialRequestStream
    .merge(requestOnRefreshStream)
    .flatMap((url) => fetchPromise(url))
    .shareReplay(1);

function getRandomUser(users) {
    return users[Math.floor(users.length * Math.random())];
}

function createSuggestionStream(responseStream, removeSuggestionStream) {
    return responseStream
        .map(getRandomUser)
        .startWith(null)
        .merge(refreshClickStream.map(() => null))
        .merge(
            removeSuggestionStream.withLatestFrom(
                responseStream,
                (event, users) => getRandomUser(users)
            )
        );
}

const removeFirstSuggestionButton = document.querySelector('.close-first-suggestion');
const removeFirstSuggestionStream = Observable.fromEvent(removeFirstSuggestionButton, 'click');

const removeSecondSuggestionButton = document.querySelector('.close-second-suggestion');
const removeSecondSuggestionStream = Observable.fromEvent(removeSecondSuggestionButton, 'click');

const removeThirdSuggestionButton = document.querySelector('.close-third-suggestion');
const removeThirdSuggestionStream = Observable.fromEvent(removeThirdSuggestionButton, 'click');

const firstSuggestionStream = createSuggestionStream(
    responseStream,
    removeFirstSuggestionStream
);

const secondSuggestionStream = createSuggestionStream(
    responseStream,
    removeSecondSuggestionStream
);

const thirdSuggestionStream = createSuggestionStream(
    responseStream,
    removeThirdSuggestionStream
);

const firstSuggestion = document.querySelector('.first-suggestion');
const secondSuggestion = document.querySelector('.second-suggestion');
const thirdSuggestion = document.querySelector('.third-suggestion');

function renderSuggestion(user, element) {
    if (!user) {
        element.style.visibility = 'hidden';
    } else {
        const username = element.querySelector('.username');
        const image = element.querySelector('img');

        element.style.visibility = 'visible';

        username.href = user.html_url;
        username.textContent = user.login;

        image.src = '';
        image.src = user.avatar_url;
    }
}

firstSuggestionStream.subscribe(user => {
    renderSuggestion(user, firstSuggestion);
});

secondSuggestionStream.subscribe(user => {
    renderSuggestion(user, secondSuggestion);
});

thirdSuggestionStream.subscribe(user => {
    renderSuggestion(user, thirdSuggestion);
});
