const nav = document.querySelector('.nav') as HTMLUListElement;
const tabs = document.querySelectorAll('.tab') as NodeListOf<HTMLButtonElement>;
const pages = document.querySelectorAll('.page') as NodeListOf<HTMLElement>;

const options = document.querySelectorAll('.switch input') as NodeListOf<HTMLInputElement>;

const streakButton = document.querySelector('#streak-button') as HTMLButtonElement;
const streakCounter = document.querySelector('#streak-status') as HTMLSpanElement;

export { nav, options, pages, streakButton, streakCounter, tabs };
