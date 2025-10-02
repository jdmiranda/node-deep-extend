/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2018 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

function isSpecificValue(val) {
	return (
		val instanceof Buffer
		|| val instanceof Date
		|| val instanceof RegExp
	);
}

function cloneSpecificValue(val) {
	if (val instanceof Buffer) {
		var x = Buffer.alloc
			? Buffer.alloc(val.length)
			: new Buffer(val.length);
		val.copy(x);
		return x;
	} else if (val instanceof Date) {
		return new Date(val.getTime());
	} else if (val instanceof RegExp) {
		return new RegExp(val);
	} else {
		throw new Error('Unexpected situation');
	}
}

/**
 * Recursive cloning array.
 * Optimized with traditional for loop for better performance.
 */
function deepCloneArray(arr) {
	var clone = [];
	var len = arr.length;
	var item, itemType;

	for (var i = 0; i < len; i++) {
		item = arr[i];
		itemType = typeof item;

		if (itemType === 'object' && item !== null) {
			if (Array.isArray(item)) {
				clone[i] = deepCloneArray(item);
			} else if (isSpecificValue(item)) {
				clone[i] = cloneSpecificValue(item);
			} else {
				clone[i] = deepExtend({}, item);
			}
		} else {
			clone[i] = item;
		}
	}
	return clone;
}

function safeGetProperty(object, property) {
	return property === '__proto__' ? undefined : object[property];
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
var deepExtend = module.exports = function (/*obj_1, [obj_2], [obj_N]*/) {
	if (arguments.length < 1 || typeof arguments[0] !== 'object') {
		return false;
	}

	if (arguments.length < 2) {
		return arguments[0];
	}

	var target = arguments[0];
	var argsLen = arguments.length;
	var obj, key, val, src, valType, srcType;

	// Optimized with traditional for loop instead of converting arguments to array
	for (var i = 1; i < argsLen; i++) {
		obj = arguments[i];

		// skip argument if isn't an object, is null, or is an array
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
			continue;
		}

		// Optimized with for-in loop instead of Object.keys().forEach()
		for (key in obj) {
			// Check hasOwnProperty to skip prototype properties
			if (!obj.hasOwnProperty(key)) {
				continue;
			}

			// Skip __proto__ for security
			if (key === '__proto__') {
				continue;
			}

			src = target[key]; // source value
			val = obj[key]; // new value

			// recursion prevention
			if (val === target) {
				continue;
			}

			// Cache typeof check for performance
			valType = typeof val;

			/**
			 * if new value isn't object then just overwrite by new value
			 * instead of extending.
			 */
			if (valType !== 'object' || val === null) {
				target[key] = val;
				continue;
			}

			// just clone arrays (and recursive clone objects inside)
			if (Array.isArray(val)) {
				target[key] = deepCloneArray(val);
				continue;
			}

			// custom cloning and overwrite for specific objects
			if (isSpecificValue(val)) {
				target[key] = cloneSpecificValue(val);
				continue;
			}

			// Cache typeof check for source
			srcType = typeof src;

			// overwrite by new value if source isn't object or array
			if (srcType !== 'object' || src === null || Array.isArray(src)) {
				target[key] = deepExtend({}, val);
				continue;
			}

			// source value and new value is objects both, extending...
			target[key] = deepExtend(src, val);
		}
	}

	return target;
};
