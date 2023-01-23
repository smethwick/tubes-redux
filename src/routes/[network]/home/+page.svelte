<script lang="ts">
	import HomeAction from './HomeAction.svelte';

	import { provider } from '$lib/Chat';
	import { error } from '@sveltejs/kit';
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	let connection = $provider.connections.find((o) => o[0] == data.network);
	if (!connection) throw error(404);

	let [_, conn] = connection;
	const { isConnected, connection_info, motd } = conn;
</script>

<section class="max-w-3xl mx-auto lg:pt-4 xl:pt-8">
	<header class="mb-4">
		<p>
			{(() => {
				switch ($isConnected) {
					case true:
						return 'connected to';
					case 'connecting':
						return 'connecting…';
					case false:
						return 'disconnected from';
				}
			})()}
		</p>
		<h1>{connection_info.display_name ?? connection_info.name}</h1>
	</header>

	<section class="grid grid-cols-3 gap-4">
		<article class="col-span-2">
			<pre>{$motd}</pre>
		</article>
		<article>
			<h2>Actions</h2>
			<ul class="flex flex-col place-content-start">
				<HomeAction on:click={() => ($isConnected ? conn.disconnect() : conn.connect())}>
					🔌 {$isConnected ? 'Disconnect' : 'Connect'}
				</HomeAction>
				<HomeAction>📜 Server Messages</HomeAction>
				<HomeAction>✏️ Configure</HomeAction>
				<HomeAction>♻️ Archive</HomeAction>
				<HomeAction on:click={() => conn.get_motd()}>♻️ get motd (debug)</HomeAction>
			</ul>
		</article>
	</section>
</section>

<style>
	h1 {
		@apply text-4xl;
		font-stretch: extra-condensed;
	}
	h2 {
		@apply text-2xl mb-1 font-[450];
		font-stretch: condensed;
	}
</style>
