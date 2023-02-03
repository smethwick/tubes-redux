<script lang="ts">
	import type { Channel } from '$lib/Chat/channel';
	import Hash from 'phosphor-svelte/lib/Hash';

	export let channel: Channel;
    const {nicks_live: nicks} = channel;
</script>

<aside class="sidebar min-w-[18rem] h-full p-4 border-l border-neutral-200">
	<div
		class="mx-auto mt-8 h-20 w-20 rounded-full flex justify-center place-items-center bg-indigo-200"
	>
		<Hash size={32} />
	</div>
	<div class="text-center mt-4">
		<h3 class="text-xl font-semibold">{channel.name}</h3>
		<p>{$nicks.length} Members</p>
	</div>
</aside>
