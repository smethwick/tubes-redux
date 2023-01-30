<script lang="ts">
	import { goto } from '$app/navigation';
	import MenuBase from './MenuBase.svelte';
	import MenuItem from './MenuItem.svelte';
</script>

<MenuBase class="-ml-36">
	<svelte:fragment slot="text">💥 help!</svelte:fragment>
	<MenuItem on:click={() => goto('/manual')} icon="📖">Manual</MenuItem>
</MenuBase>
