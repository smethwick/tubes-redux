<script lang="ts">
	import type { ConnectionInfo } from '$lib/Chat/provider+connection';

	export let network: ConnectionInfo;
</script>

<li
	class="
		flex w-10 h-10 aspect-square bg-neutral-700/5 rounded-2xl
		text-sm 
		place-items-center justify-center border border-neutral-300"
	aria-label={network.name}
>
	{network.icon}
</li>
