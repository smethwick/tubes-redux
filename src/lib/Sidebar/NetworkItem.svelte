<script lang="ts">
	import type { ConnectionInfo } from '$lib/Chat/provider+connection';

	export let network: ConnectionInfo;
</script>

<li
	class="
		flex w-10 h-10 aspect-square bg-neutral-600/5 rounded-2xl
		overflow-hidden
		place-items-center justify-center"
	aria-label={network.name}
>
	<span>
		{network.display_name ? network.display_name.substring(0, 2) : network.name.substring(0, 2)}
	</span>
	<!-- <span class="opacity-25 rotate-12 select-none relative -bottom-2 -right-1 text-3xl">{network.icon}</span> -->
</li>
