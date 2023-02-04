<script lang="ts">
	import { page } from '$app/stores';
	export let href = '';

	$: active = $page.url.toString().endsWith(href.replace('.', ''));
</script>

<li>
	<a
		class="flex px-2.5 py-1 hover:bg-pink-500/10 text-neutral-600 
			rounded-md duration-[25ms] ease-out transition-colors select-none"
		class:active
		{href}
	>
		<slot />
	</a>
</li>

<style>
	.active {
		@apply bg-pink-300 hover:bg-pink-300 text-black;
	}
</style>
