<script lang="ts">
	import TopBar from '$lib/Display/TopBar/TopBar.svelte';
</script>

<div class="w-screen h-full flex">
	<TopBar />

	<slot />
</div>
