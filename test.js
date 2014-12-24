var assert = require("assert")
var through = require("through2")
var concat = require("concat-stream")
var DiffStream = require("./")

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

var write = concat(function(diffs) {
  assert.deepEqual(diffs, [
    {before: {id: 2, name: "Shemp"}},
    {after: {id: 4, name: "Curly"}}
  ])
})

diff.pipe(write)
