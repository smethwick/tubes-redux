<script lang="ts">
	import ChannelView from '$lib/Display/Channel/ChannelView.svelte';

	export let data;

	const { connection: conn } = data;
	const channel = data.channel;
	const { isConnected } = conn;

	$: open_sidebar = false;
</script>

<svelte:head>
	<title>{channel.name} • {conn.connection_info.display_name} • Tubes</title>
</svelte:head>

{#key channel}
	<ChannelView {channel} connection={conn} />
{/key}
