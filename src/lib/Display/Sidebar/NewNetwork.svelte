<script lang="ts">
	import { page } from '$app/stores';
	import type { ConnectionInfo } from '$lib/Chat/provider+connection';
	import NewConnection from '$lib/Display/Dialogs/NewConnection/NewConnection.svelte';
	import Plus from 'phosphor-svelte/lib/Plus';

	let conn_dialog = false;
</script>

<button
	class="
		flex w-10 bg-purple-100 h-10  rounded-2xl
		overflow-hidden
		place-items-center justify-center"
	aria-label="Add Network"
	on:click={() => (conn_dialog = true)}
>
	<Plus size={17} />
	<!-- <span class="opacity-25 rotate-12 select-none relative -bottom-2 -right-1 text-3xl">{network.icon}</span> -->
</button>

<NewConnection bind:isopen={conn_dialog} />

<style>
	button {
		min-width: 2.5rem;
	}
</style>