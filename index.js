var through = require("through2")
var tupleStream = require("tuple-stream2")
var deepEqual = require("deep-equal")

module.exports = function(streams, options) {
  if (!options) options = {}

  var keys = Object.keys(streams)

  if (keys.length != 2) {
    throw new Error("Expected 2 streams, received " + keys.length + ".")
  }

  var evaluator = options.evaluator || deepEqual
  var tuples = tupleStream(streams, options)
  var evaluate = through.obj(onTuple)

  return tuples.pipe(evaluate)

  function onTuple(data, enc, cb) {
    var same = keys.slice(1).every(function(key) {
      return evaluator(data[keys[0]], data[key])
    })

    same ? cb() : cb(null, data)
  }
}
