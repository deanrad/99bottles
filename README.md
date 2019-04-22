# 99 Bottles of Sync and Async

This app does the 99 bottles of beer song, as mentioned in 99 Bottles of OOP by Sandi Metz, but compares Ruby and JavaScript implementations.

In addition, the JS is done in an events+Observable style which allows us to control the timing to produce this beauty:

![](https://d3a1eqpdtt5fg4.cloudfront.net/items/190u1b1k362a1a070j0H/Screen%20Recording%202019-04-22%20at%2004.36%20PM.gif?v=b66eece3)

Delays are tunable via constants `LETTER_DELAY`, and `VERSE_DELAY`.

# Scripts

- `npm run js` - Runs the javascript version
- `npm run ruby` - Runs the Ruby version
- `npm test` - Runs the JS and Ruby versions, and outputs `FILES ARE THE SAME` if their output matches.

# Ruby

To add delays after each letter, or verse, a `sleep` statement is all that's needed.

# JS

The JS is done in an evented style - meaning events (aka actions) are triggered, and their handlers return Observables which either a) provide for consequences (aka side-effects) or b) return Observables of other events.

The source of [bottles.js](/deanius/99bottles/tree/master/bottles.js) is annotated with comments on how the code works.

Events:

- `singIt` - payload: the # of verses. Returns an Observable of events of type `"verse"`.
- `verse` - payload: the number to sing. Returns an Observable of keystrokes being logged to the console with variable timing.

# Glossary

- **Actions** - Event objects. Plain old JS objects, with standard fields `type` and `payload`, conforming to the Flux Standard Actions spec.
- **Handlers** - Event handling functions which return Observables so their overlap can be configured not to run all at once, for example.
