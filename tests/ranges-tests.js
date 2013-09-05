(function (aloha) {
	'use strict';

	var ranges = aloha.ranges;
	var boundarymarkers = aloha.boundarymarkers;
	var tested = [];

	module('ranges');

	function runTest(before, after, op) {
		var dom = $(before)[0];
		var range = ranges.create();
		boundarymarkers.extract(dom, range);
		op(range);
		boundarymarkers.insert(range);
		equal(dom.outerHTML, after, before + ' ⇒ ' + after);
	}

	test('expand()', function () {
		tested.push('expand');
		var t = function (before, after) {
			return runTest(before, after, ranges.expand);
		};
		t('<p>x{<b>y</b>}</p>',               '<p>x{<b>y</b>}</p>');
		t('<p>x<b>y[]</b>z</p>',              '<p>x<b>y[</b>}z</p>');
		t('<p>x<b>[]</b>y</p>',               '<p>x{<b></b>}y</p>');
		t('<p><b>[x]</b></p>',                '<p>{<b>x</b>}</p>');
		t('<p><u><b>[x]</b></u></p>',         '<p>{<u><b>x</b></u>}</p>');
		t('<p>w<i><u>{<b>x]</b></u></i></p>', '<p>w{<i><u><b>x</b></u></i>}</p>');
		t('<p><b>[x]</b>y</p>',               '<p>{<b>x</b>}y</p>');
		t('<p>x<b>[y]</b>z</p>',              '<p>x{<b>y</b>}z</p>');
		t('<p><b>x[y]z</b></p>',              '<p><b>x[y]z</b></p>');
	});

	test('contract()', function () {
		tested.push('contract');
		var t = function (before, after) {
			return runTest(before, after, ranges.contract);
		};

		// problem with boundarymarker.insert()
		//t('<p><b>[foo}</b></p>', '<p><b>[foo}</b></p>');

		t('<p>{<b>}</b></p>',                  '<p>{}<b></b></p>');
		t('<p><b>{</b>}</p>',                  '<p><b>{}</b></p>');
		t('<p>foo{<b></b>}</p>',               '<p>foo{}<b></b></p>');
		t('<p><b>{</b><u></u>}</p>',           '<p><b>{}</b><u></u></p>');
		t('<p><b>{foo}</b></p>',               '<p><b>{foo}</b></p>');
		t('<p>{<b><i><u>}</u></i></b></p>',    '<p>{}<b><i><u></u></i></b></p>');
		t('<p>{<b><i><u>foo}</u></i></b></p>', '<p><b><i><u>{foo}</u></i></b></p>');
		t('<p>{<b><i></i>foo}</b></p>',        '<p><b><i></i>{foo}</b></p>');
		t('<p>{<b><i></i><br>foo}</b></p>',    '<p><b><i></i><br>{foo}</b></p>');
	});

	testCoverage(test, tested, ranges);
}(window.aloha));
