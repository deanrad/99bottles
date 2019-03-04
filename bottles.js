const Singer = require("rx-helper").agent;
const { after } = require("rx-helper");
const { range, from } = require("rxjs");
const { map, concatMap, delay } = require("rxjs/operators");

const MAX = 9;
const LETTER_DELAY = 30;
const VERSE_DELAY = 800;
// Singer.addFilter(({ action }) =>
//   console.log(`${action.type}: ${action.payload}`)
// );

Singer.on(
  "singIt",
  () => {
    return range(0, MAX + 1).pipe(map(i => MAX - i));
  },
  {
    type: "verse"
  }
);

Singer.on(
  "verse",
  ({ action }) => {
    const number = action.payload;
    //prettier-ignore
    const message = `${pluralOf(number, true)} of beer on the wall, ${pluralOf(number)} of beer.
${ending(number)}

`;
    return from(message).pipe(
      delay(VERSE_DELAY),
      concatMap(letter =>
        after(LETTER_DELAY, () => process.stdout.write(letter))
      )
    );
  },
  {
    concurrency: "serial"
  }
);

function pluralOf(count, capital = false, noun = "bottle") {
  if (count >= 2) {
    return `${count} ${noun}s`;
  } else if (count == 1) {
    return `${count} ${noun}`;
  } else {
    return (capital ? "No" : "no") + ` more ${noun}s`;
  }
}

function ending(number) {
  const article = number == 1 ? "it" : "one";
  return number == 0
    ? "Go to the store and buy some more, 99 bottles of beer on the wall."
    : `Take ${article} down and pass it around, ${pluralOf(
        number - 1
      )} of beer on the wall.`;
}

Singer.process({ type: "singIt" });
