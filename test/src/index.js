import App from './App.svelte';
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
test('exists', (t) => {
	const app = new App({
		target
	});

	assert.equal(app.scroller.index, 0);
	assert.equal(app.scroller.count, 0);
	assert.equal(app.scroller.top, 0);
	assert.equal(app.scroller.bottom, 1);
	assert.equal(app.scroller.threshold, 0.5);

	// TODO write some more tests

	app.$destroy();
});

// this allows us to close puppeteer once tests have completed
window.done = done;
