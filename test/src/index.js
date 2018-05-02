import svelte from 'svelte';
import Scroller from '../..';
import { assert, test, done } from 'tape-modern';

// setup
const target = document.querySelector('main');

function normalize(html) {
	const div = document.createElement('div');
	div.innerHTML = html
		.replace(/<!--.+?-->/g, '')
		.replace(/svelte-ref-\w+=""/g, '')
		.replace(/\s*svelte-\w+\s*/g, '')
		.replace(/class=""/g, '')
		.replace(/>\s+/g, '>')
		.replace(/\s+</g, '<');

	div.normalize();
	return div.innerHTML;
}

assert.htmlEqual = (a, b, msg) => {
	assert.equal(normalize(a), normalize(b));
};

// tests
test('has expected defaults', t => {
	const scroller = new Scroller({
		target
	});

	t.equal(scroller.get().index, 0);
	t.equal(scroller.get().count, 0);
	t.equal(scroller.get().top, 0);
	t.equal(scroller.get().bottom, 1);
	t.equal(scroller.get().threshold, 0.5);

	scroller.destroy();
});

// TODO write more tests

// this allows us to close puppeteer once tests have completed
window.done = done;