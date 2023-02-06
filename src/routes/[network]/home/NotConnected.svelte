<script lang="ts">
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
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import Dismissable from '$lib/Display/Etc/Dismissable.svelte';
	import NetworkAdded from './NetworkAdded.svelte';

	export let conn: IrcConnection;
	export let duration: number;
	const transision = (n: Element, opt?: { delay: number }) =>
		scale(n, { duration, start: 0.75, easing: quintOut, delay: duration ? opt?.delay : 0 });
	const other_other_transision = (n: Element, opt?: { delay: number }) =>
		slide(n, { duration, easing: quintOut, delay: duration ? opt?.delay : 0 });
</script>

<div in:other_other_transision|local out:other_other_transision|local={{ delay: 75 }}>
	<div in:transision|local={{ delay: 150 }} out:transision|local={{ delay: 50 }} class="mb-6">
		<Dismissable let:dismiss key="welcome:{conn.connection_info.name}">
			<NetworkAdded {dismiss} {conn} />
		</Dismissable>
		<DisconnectedBanner color={conn.styles.color_name} {conn} />
		<div class="mt-2 flex flex-wrap gap-4">
			<HomeAction on:click={() => goto('./edit')}>✏️ Configure</HomeAction>
			<HomeAction>♻️ Archive</HomeAction>
		</div>
	</div>
</div>

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
