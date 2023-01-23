<script lang="ts">
	import HomeAction from './HomeAction.svelte';
	import { provider } from '$lib/Chat';
	import { error } from '@sveltejs/kit';
	import type { LayoutData } from './$types';
	import YellingThing from '$lib/Display/RegistrationFlow/YellingThing.svelte';
	import DisconnectedBanner from '$lib/Display/Network/DisconnectedBanner.svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data: LayoutData;

	let connection = $provider.connections.find((o) => o[0] == data.network);
	if (!connection) throw error(404);

	let [_, conn] = connection;
	const { isConnected, connection_info, motd } = conn;
</script>

<section class="max-w-3xl mx-auto lg:pt-4 xl:pt-8">
	<header class="mb-6">
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

	{#if $isConnected === false}
		<div transition:slide={{duration: 250, easing: quintOut}} class="mb-8">
			<DisconnectedBanner on:click={() => conn.connect()} />
		</div>
	{/if}

	<section class="grid grid-cols-3 gap-6" class:disconnected={!$isConnected}>
		<article class="col-span-2">
			<YellingThing />
		</article>
		<article>
			<h2>Actions</h2>
			<ul class="flex flex-col place-content-start">
				<HomeAction on:click={() => ($isConnected ? conn.disconnect() : conn.connect())}>
					🔌 {$isConnected ? 'Disconnect' : 'Connect'}
				</HomeAction>
				<HomeAction>🔭 Browse Channels</HomeAction>
				<HomeAction>👋 Join/Create Channel</HomeAction>
				<HomeAction>📜 Server Messages</HomeAction>
				<HomeAction>✏️ Configure</HomeAction>
				<HomeAction>♻️ Archive</HomeAction>
			</ul>
		</article>
	</section>

	<section class:disconnected={!$isConnected}>
		{#if $motd}
			<h2>Message of the Day</h2>
			<pre style="white-space: pre-wrap;">{$motd}</pre>
		{/if}
	</section>
</section>

<style>
	h1 {
		@apply text-4xl;
		font-stretch: extra-condensed;
	}
	h2 {
		@apply text-2xl mb-2 font-[450];
		font-stretch: condensed;
	}

	.disconnected {
		opacity: 0.25;
		user-select: none;
		pointer-events: none;
	}
</style>
