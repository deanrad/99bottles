const Singer = require("rx-helper").agent;
const { after } = require("rx-helper");
const { range, from } = require("rxjs");
const { map, concatMap, delay } = require("rxjs/operators");

const MAX = 9;
const LETTER_DELAY = 30;
const VERSE_DELAY = 400;

// Uncomment to print all actions, regardless of type (Regex /./ matches anything)
// Singer.filter(/./, ({ action }) =>
//   console.log(`${action.type}: ${action.payload}`)
// );

// On being told 'singIt', all verses will be emitted as events effectively immediately
Singer.on(
  "singIt",
  ({ action }) => {
    const verseCount = action.payload;
    return range(0, verseCount + 1).pipe(map(i => verseCount - i));
  },
  {
    type: "verse"
  }
);

// Verses get sung serially (concurrency: serial).
// To allow this to happen, the return value from the on("verse") handler
// must be an Observable that incorporates all the time it take to type each letter
// with our specified delaty. So we delay by VERSE_DELAY, then for each letter,
// create an Observable of the printing of that letter. We combine the letter-printing
// Observables with rxjs concatMap, which is rxjs lingo for 'serial'.
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

// Kick it all off
Singer.process({ type: "singIt", payload: MAX });
