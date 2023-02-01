<script lang="ts">
	import { page } from '$app/stores'
	export let href = '';

	$: active = $page.url.toString().endsWith(href.replace(".", ""));
</script>

<a {href}>
	<li
		class="flex px-2.5 py-1 hover:bg-pink-500/10 text-neutral-600 
            rounded-md duration-[25ms] ease-out transition-colors"
		class:active
	>
		<slot />
	</li>
</a>

<style>
	.active {
		@apply bg-pink-300 hover:bg-pink-300 text-black;
	}
</style>
