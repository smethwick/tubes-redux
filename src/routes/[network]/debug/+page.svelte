<script lang="ts">
	import { goto } from '$app/navigation';
	import { provider } from '$lib/Chat';
	import { ProviderFlags } from '$lib/Chat/flags';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import TextInput from '$lib/Display/Forms/TextInput.svelte';
	import Toggle from '$lib/Display/Forms/Toggle.svelte';
	import List from '$lib/Display/Lists/List.svelte';
	import ListItem from '$lib/Display/Lists/ListItem.svelte';
	import Item from '$lib/Display/Lists/ListItem.svelte';
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';
	import Hash from 'phosphor-svelte/lib/Hash';
	import Plus from 'phosphor-svelte/lib/Plus';
	import { quadOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	let protos = provider.supported_protos;
	const {
		connection,
		connection: { connection_info: ci }
	} = data;
</script>

<Content>
	<Header back>Debugging Information</Header>

	<h2>Jump To</h2>
	<ul>
		<li><a href="#caps">Capabilities</a></li>
	</ul>

	<h2 id="caps">Capabilities</h2>
	<h3>Active</h3>
	<List>
		{#each connection.capman.capabilities as cap}
			<Item>{cap.cap}</Item>
		{/each}
	</List>

	<h3>Requested</h3>
	<List>
		{#each connection.requested_caps as cap}
			<Item>{cap}</Item>
		{/each}
	</List>

	<h3>Avaliable</h3>
	<List>
		{#each connection.capman.available as cap}
			<Item>{cap.cap}</Item>
		{/each}
	</List>
</Content>
