<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ConnectionInfo } from '$lib/Chat/provider+connection';

	export let network: ConnectionInfo;

	$: active = $page.params['network'] == network.name;

	let text = network.display_name ?? network.name;
	let abbr = network.display_name ? network.display_name.substring(0, 2) : network.name.substring(0, 2);
</script>

<button
	class="
		flex {active ? "w-max px-4 bg-purple-400" : "w-10 bg-purple-200"} h-10  rounded-2xl
		overflow-hidden
		place-items-center justify-center"
	aria-label={network.name}
	on:click={() => goto(`/${network.name}/home`)}
>
	<span>
		{active ? text : abbr}
	</span>
	<!-- <span class="opacity-25 rotate-12 select-none relative -bottom-2 -right-1 text-3xl">{network.icon}</span> -->
</button>

