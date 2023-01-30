<script lang="ts">
	import { goto } from '$app/navigation';
	import { quintOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';
	import Donate from '../Dialogs/Donate.svelte';
	import MenuBase from './MenuBase.svelte';
	import MenuItem from './MenuItem.svelte';

	let isopen = false,
		donate = false,
		about = false;

	const duration = 150,
		easing = quintOut,
		opacity = 0.1;
</script>

<MenuBase>
	<svelte:fragment slot="text">⛺ tubes!</svelte:fragment>
	<MenuItem on:click={() => goto('/config')} icon="🔧">Configure Tubes…</MenuItem>
	<MenuItem on:click={() => (donate = true)} icon="💷">Donate…</MenuItem>
	<MenuItem icon="ℹ️">About…</MenuItem>
</MenuBase>
