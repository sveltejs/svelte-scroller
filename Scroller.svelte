<script context="module">
	const handlers = [];
	let manager;

	if (typeof window !== 'undefined') {
		function run(fn) {
			fn();
		}

		window.addEventListener('scroll', () => {
			handlers.forEach(run);
		});
	}

	if (typeof IntersectionObserver !== 'undefined') {
		const map = new Map();

		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				const update = map.get(entry.target);
				const index = handlers.indexOf(update);

				if (entry.isIntersecting) {
					if (index === -1) handlers.push(update);
				} else {
					update();
					if (index !== -1) handlers.splice(index, 1);
				}
			});
		}, {
			rootMargin: '400px 0px' // TODO why 400?
		});

		manager = {
			add: ({ outer, update }) => {
				const { top, bottom } = outer.getBoundingClientRect();

				if (top < window.innerHeight && bottom > 0) handlers.push(update);

				map.set(outer, update);
				observer.observe(outer);
			},

			remove: ({ outer, update }) => {
				const index = handlers.indexOf(update);
				if (index !== -1) handlers.splice(index, 1);

				map.delete(outer);
				observer.unobserve(outer);
			}
		};
	} else {
		manager = {
			add: ({ update }) => {
				handlers.push(update);
			},

			remove: ({ update }) => {
				const index = handlers.indexOf(update);
				if (index !== -1) handlers.splice(index, 1);
			}
		};
	}
</script>

<script>
	import { onMount } from 'svelte';

	// config
	export let top = 0;
	export let bottom = 1;
	export let threshold = 0.5;
	export let query = 'section';
	export let parallax = false;

	// bindings
	export let index = 0;
	export let count = 0;
	export let offset = 0;
	export let progress = 0;

	let outer;
	let background;
	let foreground;
	let foreground_height;
	let background_height;
	let left;
	let sections;
	let wh = 0;
	let fixed;
	let offset_top;
	let width;
	let height;
	let inverted;

	$: top_px = Math.round(top * wh);
	$: bottom_px = Math.round(bottom * wh);
	$: threshold_px = Math.round(threshold * wh);

	$: (top, bottom, threshold, parallax, update());

	$: style = `
		position: ${fixed ? 'fixed' : 'absolute'};
		top: 0;
		transform: translate(0, ${offset_top}px);
		width: ${width}px;
		z-index: ${inverted ? 3 : 1};
	`;

	onMount(() => {
		sections = foreground.querySelectorAll(query);
		count = sections.length;

		handle_resize();
		update();

		const scroller = { outer, update };

		manager.add(scroller);
		return () => manager.remove(scroller);
	});

	function update() {
		if (!foreground) return;

		// determine fix state
		const fg = foreground.getBoundingClientRect();
		const bg = background.getBoundingClientRect();

		foreground_height = fg.bottom - fg.top;
		background_height = bg.bottom - bg.top;

		const available_space = bottom_px - top_px;
		progress = (top_px - fg.top) / (foreground_height - available_space);

		if (progress <= 0) {
			offset_top = 0;
			fixed = false;
			offset = 0;
			index = -1;
		} else if (progress >= 1) {
			offset_top = parallax
				? (foreground_height - background_height)
				: (foreground_height - available_space);
			fixed = false;
			offset = 1;
			index = sections.length - 1;
		} else {
			offset_top = parallax ?
				Math.round(top_px - progress * (background_height - available_space)) :
				top_px;
			fixed = true;

			for (index = 0; index < sections.length; index += 1) {
				const section = sections[index];
				const { top } = section.getBoundingClientRect();

				const next = sections[index + 1];
				const bottom = next ? next.getBoundingClientRect().top : fg.bottom;

				if (bottom >= threshold_px) {
					offset = (threshold_px - top) / (bottom - top);
					break;
				}
			}
		}
	}

	function handle_resize() {
		const bcr = outer.getBoundingClientRect();

		const bg = background.getBoundingClientRect();
		const fg = foreground.getBoundingClientRect();

		width = bcr.right - bcr.left;
		foreground_height = fg.bottom - fg.top;
		background_height = bg.bottom - bg.top;
		left = bcr.left;
	}
</script>

<svelte:window bind:innerHeight={wh} on:resize={handle_resize}/>

<svelte-scroller-outer bind:this={outer}>
	<svelte-scroller-background-container class='background-container' {style}>
		<svelte-scroller-background bind:this={background}>
			<slot name="background"></slot>
		</svelte-scroller-background>
	</svelte-scroller-background-container>

	<svelte-scroller-foreground bind:this={foreground}>
		<slot name="foreground"></slot>
	</svelte-scroller-foreground>
</svelte-scroller-outer>

<style>
	svelte-scroller-outer {
		display: block;
		position: relative;
	}

	svelte-scroller-background {
		display: block;
		position: relative;
		width: 100%;
	}

	svelte-scroller-foreground {
		display: block;
		position: relative;
		z-index: 2;
	}

	svelte-scroller-foreground::after {
		content: ' ';
		display: block;
		clear: both;
	}

	svelte-scroller-background-container {
		display: block;
		position: absolute;
		width: 100%;
		pointer-events: none;
		/* height: 100%; */

		/* in theory this helps prevent jumping */
		will-change: transform;
		/* -webkit-transform: translate3d(0, 0, 0);
		-moz-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0); */
	}
</style>