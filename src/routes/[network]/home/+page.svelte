<script lang="ts">
	import HomeAction from './HomeAction.svelte';
	import { provider } from '$lib/Chat';
	import { error } from '@sveltejs/kit';
	import type { LayoutData } from './$types';
	import YellingThing from '$lib/Display/RegistrationFlow/YellingThing.svelte';
	import DisconnectedBanner from '$lib/Display/Network/DisconnectedBanner.svelte';
	import { fade, scale, slide } from 'svelte/transition';
	import { quadOut, quintOut } from 'svelte/easing';
	import { navigating } from '$app/stores';
	import GoodAdvice from '$lib/Display/Setup/GoodAdvice.svelte';

	export let data: LayoutData;

	let connection = $provider.connections.find((o) => o[0] == data.network);
	if (!connection) throw error(404);

	let [_, conn] = connection;
	const { isConnected, connection_info, motd } = conn;

	$: notconnected = ($isConnected == false) || ($isConnected == "connecting");

	const transision = (n: Element, opt?: {delay: number}) =>
		scale(n, { duration: $navigating ? 0 : 500, start: 0.75, easing: quintOut, delay: opt?.delay });

	const other_transition = (n: Element, opt?: {delay: number}) =>
		fade(n, { duration: $navigating ? 0 : 250, easing: quintOut, delay: opt?.delay });

	const other_other_transision = (n: Element, opt?: {delay: number}) =>
		slide(n, { duration: $navigating ? 0 : 500, easing: quintOut, delay: opt?.delay });

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

	{#if notconnected}
		{#if $navigating}
			<div class="mb-6">
				<DisconnectedBanner on:click={() => conn.connect()} />
			</div>
		{:else}
		<div in:other_other_transision out:other_other_transision={{delay: 75}}>
			<div in:transision={{delay: 100}} out:transision={{delay: 50}} class="mb-6">
				<DisconnectedBanner on:click={() => conn.connect()} />
			</div>
		</div>
		{/if}
	{/if}

	{#if !notconnected}
		<section
			class="grid grid-cols-3 gap-6"
			class:disconnected={notconnected}
			aria-hidden={notconnected}
			in:other_transition={{delay: 100}}
			out:other_transition
		>
			<section class="col-span-2">
				<GoodAdvice {connection_info} />
				<YellingThing />
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

		<section
			class="fade"
			in:other_transition={{delay: 100}}
			out:other_transition
			class:disconnected={notconnected}
			aria-hidden={notconnected}
		>
			{#if $motd}
				<h2>Message of the Day</h2>
				<pre style="white-space: pre-wrap;">{$motd}</pre>
			{/if}
		</section>
	{/if}
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
</style>
