<script lang="ts">
	import type { Channel } from "$lib/Chat/channel";
	import type { IrcConnection } from "$lib/Chat/provider+connection";
	import MessageListLoader from "./MessageListLoader.svelte";

    export let channel: Channel;
    export let connection: IrcConnection;
</script>

<MessageListLoader {channel} {connection} />
