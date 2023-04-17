<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import type { conn_styles } from '$lib/Chat/provider+connection';
	import { tick } from 'svelte';
	import { messagelist } from './list';
	import UnreadMarker from '$lib/Display/Sidebar/UnreadMarker.svelte';
	import Check from 'phosphor-svelte/lib/Check';

	export let channel: Channel;
	export let styles: conn_styles;

	const unread = channel.session.unread_live;
</script>

{#if $unread}
	<div class="bg-{styles.color_name}-300 flex place-items-center gap-1.5 px-4 py-1 text-sm lowercase">
		<UnreadMarker>{$unread}</UnreadMarker> Unread {$unread == 1 ? 'Message' : 'Messages'}
		<button
			class="ml-auto flex place-items-center gap-1 font-semibold"
			on:click={() => {
                $unread = 0;
                channel.session.unread = 0;
			}}
		>
			<Check />Mark Read
		</button>
	</div>
{/if}
