<script lang="ts">
	import Header from './Header.svelte';
	import Cards from './Cards.svelte';
	import Actions from './Actions.svelte';
	import NotConnected from './NotConnected.svelte';
	import MotdSection from './MotdSection.svelte';
	import type { LayoutData } from './$types';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data: LayoutData;

	const connection = data.connection;

	const conn = connection;
	const isConnected = conn.isConnected;
	const motd = conn.motd;

	$: notconnected = $isConnected == false || $isConnected == 'connecting';

	const duration = 500;

	const other_transition = (n: Element, opt?: { delay: number }) =>
		fade(n, { duration, easing: quintOut, delay: duration ? opt?.delay : 0 });
</script>

<svelte:head>
	<title>{conn.connection_info.display_name} • Tubes</title>
</svelte:head>

{#key conn.connection_info.name}
	<section class="mx-auto max-w-3xl p-5 lg:pt-12 xl:pt-16">
		<Header {conn} />
		{#if notconnected}
			<NotConnected {conn} {duration} />
		{/if}

		{#if !notconnected}
			<section
				class="grid grid-cols-3 gap-6"
				class:disconnected={notconnected}
				aria-hidden={notconnected}
				in:other_transition|local={{ delay: 100 }}
				out:other_transition|local
			>
				<Cards {conn} />
				<Actions {conn} />
			</section>

			<MotdSection {motd} {duration} {notconnected} />
		{/if}
	</section>
{/key}
