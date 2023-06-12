<script lang="ts">
	import { provider } from '$lib/Chat';
	import List from '$lib/Display/Lists/List.svelte';
	import Item from '$lib/Display/Lists/ListItem.svelte';
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';
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

	<h2 id="subs">Subscriptions</h2>
	<List>
		{#each connection.task_queue.tasks as item}
		<Item>{item.id} {JSON.stringify(item.reply)}</Item>
		{/each}
	</List>

</Content>
