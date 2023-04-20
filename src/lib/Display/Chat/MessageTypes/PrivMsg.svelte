<script lang="ts">
	import { Nick } from '$lib/Chat/nick';
	import type { Message } from '$lib/Storage/messages';
	import MessageTemplate from '../MessageTemplate.svelte';
	import Color from 'color';
	import RichText from '../RichText.svelte';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import Whois from '$lib/Display/Dialogs/Whois/Whois.svelte';

	export let msg: Message;
	export let conn: IrcConnection;
	const { source: full_source, timestamp, content } = msg;
	const source = full_source ? full_source[0] : 'Unknown';

	const nick = new Nick(source);
	let whois = false;
</script>

<MessageTemplate
	{timestamp}
	class="{nick.color[1]} bg-opacity-20 dark:bg-opacity-5"
	highlight={nick.color[2]}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span
		slot="sender"
		class="cursor-pointer hover:underline {nick.color[0]}"
		class:long={nick.name.length >= 12}
		on:click={() => {
			whois = !whois;
		}}
	>
		{nick.name}
	</span>
	<span slot="content"><RichText link_colour={nick.color[2]} {content} /></span>
	<!-- <svelte:fragment slot="after">
		{#if msg.server_id}<button
				on:click={() =>
					conn.send_raw(`@+draft/reply=${msg.server_id};+draft/react=😳 TAGMSG ${msg.target}`)}
			>
				react
			</button>{/if}
	</svelte:fragment> -->
</MessageTemplate>

<Whois {conn} {nick} bind:isopen={whois} />
