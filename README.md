# svelte-scroller

A scroller component for Svelte apps.

## Installation

```bash
yarn add @sveltejs/svelte-scroller
```


## Usage

```html
<Scroller top={0.2} bottom={0.8} bind:index bind:offset bind:progress>
  <div slot="background">
    <p>
      This is the background content. It will stay fixed
      in place while the foreground scrolls over the top.
    </p>

    <p>Section {index + 1} is currently active.</p>
  </div>

  <div slot="foreground">
    <section>This is the first section.</section>
    <section>This is the second section.</section>
    <section>This is the third section.</section>
  </div>
</Scroller>

<style>
  section { height: 80vh; }
</style>

<script>
  import Scroller from '@sveltejs/svelte-scroller';

  export default {
    components: { Scroller }
  };
</script>
```

You must have one `slot="background` element and one `slot="foreground"` element — see [composing with slot](https://svelte.technology/guide#composing-with-slot) for more info.


## Parameters

The following parameters are available:

| parameter | default   | description                                                                                                                                                                                                         |
|-----------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| top       | 0         | The vertical position that the top of the foreground must scroll past before the background becomes fixed, as a proportion of window height                                                                         |
| bottom    | 1         | The inverse of `top` — once the bottom of the foreground passes this point, the background becomes unfixed                                                                                                          |
| threshold | 0.5       | Once a section crosses this point, it becomes 'active'                                                                                                                                                              |
| query     | 'section' | A CSS selector that describes the individual sections of your foreground                                                                                                                                            |
| parallax  | false     | If `true`, the background will scroll such that the bottom edge reaches the `bottom` at the same time as the foreground. This effect can be unpleasant for people with high motion sensitivity, so use it advisedly |


## `index`, `offset`, `progress` and `count`

By binding to these properties, you can track the user's behaviour:

* `index` — the currently active section
* `offset` — how far the section has scrolled past the `threshold`, as a value between 0 and 1
* `progress` — how far the foreground has travelled, where 0 is the top of the foreground crossing `top`, and 1 is the bottom crossing `bottom`
* `count` — the number of sections

You can rename them with e.g. `bind:index=i`.



## Configuring webpack

If you're using webpack with [svelte-loader](https://github.com/sveltejs/svelte-loader), make sure that you add `"svelte"` to [`resolve.mainFields`](https://webpack.js.org/configuration/resolve/#resolve-mainfields) in your webpack config. This ensures that webpack imports the uncompiled component (`src/index.html`) rather than the compiled version (`index.mjs`) — this is more efficient.

If you're using Rollup with [rollup-plugin-svelte](https://github.com/rollup/rollup-plugin-svelte), this will happen automatically.



## Using without Svelte

You can also use `<Scroller>` in a non-Svelte app:

```js
import Scroller from '@sveltejs/svelte-scroller';

const background = document.createElement('div');
background.innerHTML = someHTML;

const foreground = document.createElement('div');
foreground.innerHTML = someMoreHTML;

const scroller = new Scroller({
  target: document.querySelector('#scroller-target'),
  data: { top: 0.1, bottom: 0.9 },
  slots: { background, foreground }
});
```

## License

[LIL](LICENSE)
