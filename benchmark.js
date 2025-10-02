'use strict';

var extend = require('./index');

function benchmark(name, fn, iterations) {
	var start = Date.now();
	for (var i = 0; i < iterations; i++) {
		fn();
	}
	var end = Date.now();
	var totalTime = end - start;
	var avgTime = totalTime / iterations;
	console.log(name + ':');
	console.log('  Total time: ' + totalTime + 'ms');
	console.log('  Iterations: ' + iterations);
	console.log('  Average: ' + avgTime.toFixed(4) + 'ms per operation');
	console.log('  Ops/sec: ' + Math.round(iterations / (totalTime / 1000)));
	console.log('');
	return totalTime;
}

console.log('Deep Extend Performance Benchmarks');
console.log('===================================\n');

// Benchmark 1: Shallow object merge
var shallow1 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
var shallow2 = { f: 6, g: 7, h: 8, i: 9, j: 10 };
benchmark('Shallow object merge (10 properties)', function() {
	extend({}, shallow1, shallow2);
}, 100000);

// Benchmark 2: Deep object merge (2 levels)
var deep1 = {
	a: 1,
	b: 2,
	nested: {
		x: 1,
		y: 2,
		z: 3
	}
};
var deep2 = {
	c: 3,
	d: 4,
	nested: {
		w: 4,
		v: 5
	}
};
benchmark('Deep object merge (2 levels)', function() {
	extend({}, deep1, deep2);
}, 50000);

// Benchmark 3: Very deep object merge (4 levels)
var veryDeep1 = {
	level1: {
		level2: {
			level3: {
				level4: {
					a: 1, b: 2, c: 3
				}
			}
		}
	}
};
var veryDeep2 = {
	level1: {
		level2: {
			level3: {
				level4: {
					d: 4, e: 5, f: 6
				}
			}
		}
	}
};
benchmark('Very deep object merge (4 levels)', function() {
	extend({}, veryDeep1, veryDeep2);
}, 50000);

// Benchmark 4: Array cloning
var withArrays = {
	arr1: [1, 2, 3, 4, 5],
	arr2: [6, 7, 8, 9, 10],
	arr3: [11, 12, 13, 14, 15]
};
benchmark('Object with arrays', function() {
	extend({}, withArrays);
}, 50000);

// Benchmark 5: Complex nested structure (realistic use case)
var complex1 = {
	name: 'User',
	settings: {
		theme: 'dark',
		notifications: {
			email: true,
			push: false,
			sms: true
		},
		privacy: {
			profile: 'public',
			activity: 'friends'
		}
	},
	data: [1, 2, 3, 4, 5]
};
var complex2 = {
	age: 30,
	settings: {
		language: 'en',
		notifications: {
			push: true
		},
		privacy: {
			messages: 'private'
		}
	},
	data: [6, 7, 8, 9, 10]
};
benchmark('Complex nested structure (realistic)', function() {
	extend({}, complex1, complex2);
}, 50000);

// Benchmark 6: Multiple source objects
var multi1 = { a: 1, b: 2 };
var multi2 = { c: 3, d: 4 };
var multi3 = { e: 5, f: 6 };
var multi4 = { g: 7, h: 8 };
benchmark('Multiple source objects (4 sources)', function() {
	extend({}, multi1, multi2, multi3, multi4);
}, 50000);

// Benchmark 7: Large object (50 properties)
var large1 = {};
var large2 = {};
for (var i = 0; i < 25; i++) {
	large1['prop' + i] = i;
	large2['prop' + (i + 25)] = i + 25;
}
benchmark('Large object merge (50 properties)', function() {
	extend({}, large1, large2);
}, 50000);

console.log('Benchmarks completed successfully!');
