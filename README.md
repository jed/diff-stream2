diff-stream2
============

[![build status](https://secure.travis-ci.org/jed/diff-stream2.svg)](http://travis-ci.org/jed/diff-stream2)

Merges two sorted streams into a diffed tuple stream

Example
-------

```javascript
var through = require("through2")
var DiffStream = require("diff-stream2")

// an object map of streams, but could also be an array
var streams = {
  before: through.obj(),
  after: through.obj()
}

streams.before.write({id: 1, name: "Moe"})
streams.before.write({id: 2, name: "Shemp"})
streams.before.write({id: 3, name: "Larry"})
streams.before.end()

streams.after.write({id: 1, name: "Moe"})
streams.after.write({id: 3, name: "Larry"})
streams.after.write({id: 4, name: "Curly"})
streams.after.end()

function comparator(a, b){ return !a ? 1 : !b ? -1 : a.id - b.id }

var diff = DiffStream(streams, {comparator: comparator})

tuples.on("data", console.log)

//  {before: {id: 2, name: "Shemp"}},
//  {after: {id: 4, name: "Curly"}}
```

API
---

### DiffStream(streams, [options])

Returns a readable stream.

`streams` is a required object or array of readable streams, each of which must already be sorted according to the `comparator`. To use an unsorted stream, first pipe it through something like [sort-stream2](https://github.com/jed/sort-stream2). At this time, only two streams are supported.

`options` is an optional object that can contain the following key:

- `comparator`: an optional function used to sort streams. It follows the specification used for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), and defaults to `function(){ return 0 }`.

- `evaluator`: an optional function used to evaluate item equality, which defaults to [deep-equal](https://github.com/substack/node-deep-equal).

The returned stream emits values with the same keys as `streams`, but with stream _data_ instead of streams for the values. Identical tuples are omitted from the stream, leaving only those that have changed.
