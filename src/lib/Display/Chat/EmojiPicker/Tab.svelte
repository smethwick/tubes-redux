<script lang="ts">
	import type { conn_styles } from '$lib/Chat/provider+connection';

	export let active: boolean = false;

	export let styles: conn_styles;
	const { color_name: color } = styles;
</script>

<button
	on:click
	class:active
	class="flex px-3 py-1 rounded-full {active ? `bg-${color}-300` : 'hover:bg-neutral-200'}"
>
	<slot />
</button>
