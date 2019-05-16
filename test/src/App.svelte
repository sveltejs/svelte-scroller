<script>
	import Scroller from '../../Scroller.svelte';

	export let scroller;
</script>

<Scroller bind:this={scroller}>
	<div slot="background">
		<!-- TODO -->
	</div>

	<div slot="foreground">
		<!-- TODO -->
	</div>
</Scroller>