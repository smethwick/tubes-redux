<script lang="ts">
	import TopBar from '$lib/Display/TopBar/TopBar.svelte';
	import { fly } from 'svelte/transition';
	import { circIn, circOut } from 'svelte/easing';
</script>

<div
	class="w-screen h-full flex"
	in:fly={{ duration: 200, easing: circOut, opacity: 0, y: 5, delay: 200 }}
	out:fly={{ duration: 200, easing: circIn, opacity: 0, y: 5, delay: 200 }}
>
	<TopBar />

	<slot />
</div>
