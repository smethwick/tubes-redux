<script lang="ts">
	import { current_style } from '$lib/Chat';
	import type { conn_styles } from '$lib/Chat/provider+connection';

	export let active: boolean = false;

	const { color_name: color } = $current_style;
</script>

<button
	on:click
	class:active
	class="flex px-3 py-1 rounded-full {active ? `bg-${color}-300` : 'hover:bg-neutral-200'}"
>
	<slot />
</button>
