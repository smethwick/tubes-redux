<script lang="ts">
	import { page } from '$app/stores';
	import type { conn_styles } from '$lib/Chat/provider+connection';
	export let href = '';

	export let styles: conn_styles | undefined;
	$: active = $page.url.toString().endsWith(href.replace('.', ''));
</script>

<li>
	<a
		class="flex px-2.5 py-1 
		{active 
		? styles?.chan_selected ?? "bg-pink-300 hover:bg-pink-300"
		: styles?.chan_inactive ?? "hover:bg-pink-500/10"}
		place-items-center
		 text-neutral-600
			rounded-md duration-[150ms] ease-out transition-all select-none"
		class:active
		{href}
	>
		<slot />
	</a>
</li>

<style>
	.active {
		@apply  text-black;
	}
</style>
