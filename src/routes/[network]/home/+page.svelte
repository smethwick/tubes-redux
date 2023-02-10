<script lang="ts">
  import NotConnected from './NotConnected.svelte';

	import MotdSection from './MotdSection.svelte';

	import HomeAction from './HomeAction.svelte';
	import type { LayoutData } from './$types';
	import YellingThing from '$lib/Display/RegistrationFlow/YellingThing.svelte';
	import DisconnectedBanner from '$lib/Display/Network/DisconnectedBanner.svelte';
	import { fade, scale, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import GoodAdvice from '$lib/Display/Setup/GoodAdvice.svelte';
	import { goto } from '$app/navigation';
	import JoinChannel from '$lib/Display/Dialogs/JoinChannel/JoinChannel.svelte';

	export let data: LayoutData;

	$: connection = data.connection;

	// idk if $'ing all these is really needed but it errors if i don't. so. y'know.
	$: conn = connection;
	$: isConnected = conn.isConnected;
	$: connection_info = conn.connection_info;
	$: motd = conn.motd;

	$: notconnected = $isConnected == false || $isConnected == 'connecting';

	const duration = 500;

	const transision = (n: Element, opt?: { delay: number }) =>
		scale(n, { duration, start: 0.75, easing: quintOut, delay: duration ? opt?.delay : 0 });

	const other_transition = (n: Element, opt?: { delay: number }) =>
		fade(n, { duration, easing: quintOut, delay: duration ? opt?.delay : 0 });

	const other_other_transision = (n: Element, opt?: { delay: number }) =>
		slide(n, { duration, easing: quintOut, delay: duration ? opt?.delay : 0 });

	let join_diag_open = false;
</script>

{#key conn.connection_info.name}
	<section class="max-w-3xl mx-auto lg:pt-12 xl:pt-16 p-5">
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
			<NotConnected {conn} {duration}></NotConnected>
		{/if}

		{#if !notconnected}
			<section
				class="grid grid-cols-3 gap-6"
				class:disconnected={notconnected}
				aria-hidden={notconnected}
				in:other_transition|local={{ delay: 100 }}
				out:other_transition|local
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
						<HomeAction on:click={() => goto('./browse')}>🔭 Browse Channels</HomeAction>
						<HomeAction on:click={() => (join_diag_open = true)}>👋 Join/Create Channel</HomeAction>
						<HomeAction>📜 Server Messages</HomeAction>
						<HomeAction on:click={() => goto('./edit')}>✏️ Configure</HomeAction>
						<HomeAction>♻️ Archive</HomeAction>
						<HomeAction on:click={() => goto('./debug')}>🐞 Debug</HomeAction>
					</ul>
				</section>
			</section>

			<JoinChannel {conn} bind:isopen={join_diag_open} />

			<MotdSection {motd} {duration} {notconnected} />
		{/if}
	</section>
{/key}

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
