"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortByLengthDesc = exports.escapeRegExp = exports.isEmpty = exports.last = exports.trimSpacesEnd = void 0;

// Only removes spaces, not newlines
var trimSpacesEnd = function trimSpacesEnd(str) {
  return str.replace(/[\t ]+$/, '');
}; // Last element from array


exports.trimSpacesEnd = trimSpacesEnd;

var last = function last(arr) {
  return arr[arr.length - 1];
}; // True array is empty, or it's not an array at all


exports.last = last;

var isEmpty = function isEmpty(arr) {
  return !Array.isArray(arr) || arr.length === 0;
}; // Escapes regex special chars


exports.isEmpty = isEmpty;

var escapeRegExp = function escapeRegExp(string) {
  return string.replace(/[\$\(-\+\.\?\[-\^\{-\}]/g, '\\$&');
}; // Sorts strings by length, so that longer ones are first
// Also sorts alphabetically after sorting by length.


exports.escapeRegExp = escapeRegExp;

var sortByLengthDesc = function sortByLengthDesc(strings) {
  return strings.sort(function (a, b) {
    return b.length - a.length || a.localeCompare(b);
  });
};

exports.sortByLengthDesc = sortByLengthDesc;