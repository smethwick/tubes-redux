<script lang="ts">
	import HomeAction from './HomeAction.svelte';
	import { provider } from '$lib/Chat';
	import { error } from '@sveltejs/kit';
	import type { LayoutData } from './$types';
	import YellingThing from '$lib/Display/RegistrationFlow/YellingThing.svelte';
	import DisconnectedBanner from '$lib/Display/Network/DisconnectedBanner.svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { navigating } from '$app/stores';
	import GoodAdvice from '$lib/Display/Setup/GoodAdvice.svelte';

	export let data: LayoutData;

	let connection = $provider.connections.find((o) => o[0] == data.network);
	if (!connection) throw error(404);

	let [_, conn] = connection;
	const { isConnected, connection_info, motd } = conn;

	const transision = (n: Element) =>
		slide(n, { duration: $navigating ? 0 : 250, easing: quintOut });
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
		{#if $navigating}
			<div class="mb-6">
				<DisconnectedBanner on:click={() => conn.connect()} />
			</div>
		{:else}
			<div transition:transision class="mb-6">
				<DisconnectedBanner on:click={() => conn.connect()} />
			</div>
		{/if}
	{/if}

	<section
		class="grid grid-cols-3 gap-6 fade"
		class:disconnected={!$isConnected}
		aria-hidden={!$isConnected}
	>
		<section class="col-span-2">
			<GoodAdvice {connection_info} />
			<!-- <YellingThing /> -->
		</section>
		<section>
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
		</section>
	</section>

	<section class="fade" class:disconnected={!$isConnected} aria-hidden={!$isConnected}>
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

	.fade {
		transition: opacity 100ms ease-in;
	}
	.disconnected {
		opacity: 0.15;
		user-select: none;
		pointer-events: none;
	}
</style>
