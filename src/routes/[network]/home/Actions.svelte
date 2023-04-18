<script lang="ts">
	import HomeAction from './HomeAction.svelte';
	import { goto } from '$app/navigation';
	import type { IrcConnection } from '$lib/Chat/provider+connection';

	export let conn: IrcConnection;
	const isConnected = conn.isConnected;

	let join_diag_open = false;
</script>

<section>
	<h2>Actions</h2>
	<ul class="flex flex-col place-content-start">
		<HomeAction on:click={() => ($isConnected ? conn.disconnect() : conn.connect())}>
			🔌 {$isConnected ? 'Disconnect' : 'Connect'}
		</HomeAction>
		<HomeAction on:click={() => goto('./browse')}>🔭 Browse Channels</HomeAction>
		<HomeAction on:click={() => (join_diag_open = true)}>👋 Join/Create Channel</HomeAction>
		<HomeAction>📜 Server Messages</HomeAction>
		<HomeAction on:click={() => goto('./edit')}>✏️ Configure</HomeAction>
		<HomeAction>♻️ Archive</HomeAction>
		<HomeAction on:click={() => goto('./debug')}>🐞 Debug</HomeAction>
	</ul>
</section>

<style>
	h2 {
		@apply mb-2 text-2xl font-[450];
		font-stretch: condensed;
	}
</style>
