const Singer = require("rx-helper").agent;
const { after } = require("rx-helper");
const { range } = require("rxjs");
const { map } = require("rxjs/operators");

const MAX = 9;
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
    return after(1000, () => {
      console.log(`${pluralOf(number, true)} of beer on the wall, ${pluralOf(
        number
      )} of beer.
${ending(number)}
`);
    });
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
