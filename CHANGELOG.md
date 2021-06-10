# svelte-scroller changelog

## 2.0.7

- Fix initial width ([#15](https://github.com/sveltejs/svelte-scroller/pull/15))
- Update `index` more conservatively ([#14](https://github.com/sveltejs/svelte-scroller/pull/14))

## 2.0.6

- Prevent offscreen scrollers from overflowing their containers

## 2.0.5

- Add `visible` binding

## 2.0.4

- Run handlers on window resize

## 2.0.3

- Undo previous change 😬

## 2.0.2

- Use dimension bindings rather than `resize` handler for better reliability

## 2.0.1

- Make `offset` continuous before and after foreground passes threshold

## 2.0.0

- Update for Svelte 3

## 1.0.5

- Handle case where scroller abruptly disappears from viewport

## 1.0.4

- Remove instance from scroll manager on destroy
- Abort scroll handler if viewport is offscreen in browsers without IntersectionObserver

## 1.0.3

- Whoops

## 1.0.2

- Make SSR friendly

## 1.0.1

- Fix `pkg.svelte`

## 1.0.0

- First release
