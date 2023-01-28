<script lang="ts">
	import { page } from '$app/stores';
	import type { ConnectionInfo } from '$lib/Chat/provider+connection';
	import NewConnection from '$lib/Display/Dialogs/NewConnection/NewConnection.svelte';

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
	<span class="text-2xl">+</span>
	<!-- <span class="opacity-25 rotate-12 select-none relative -bottom-2 -right-1 text-3xl">{network.icon}</span> -->
</button>

<NewConnection bind:isopen={conn_dialog} />
