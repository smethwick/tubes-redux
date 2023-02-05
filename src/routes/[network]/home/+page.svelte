<script lang="ts">
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
			<div in:other_other_transision|local out:other_other_transision|local={{ delay: 75 }}>
				<div in:transision|local={{ delay: 150 }} out:transision|local={{ delay: 50 }} class="mb-6">
					<DisconnectedBanner color={conn.styles.color_name} on:click={() => conn.connect()} />
					<div class="mt-2 flex flex-wrap gap-4">
						<HomeAction on:click={() => goto('./edit')}>✏️ Configure</HomeAction>
						<HomeAction>♻️ Archive</HomeAction>
					</div>
				</div>
			</div>
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
					</ul>
				</section>
			</section>

			<JoinChannel {conn} bind:isopen={join_diag_open} />

			<section
				class="fade"
				in:other_transition|local={{ delay: 100 }}
				out:other_transition|local
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
