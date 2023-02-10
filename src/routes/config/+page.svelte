<script lang="ts">
	import Toggle from '$lib/Display/Forms/Toggle.svelte';
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';

	import { message_layout } from '$lib/Things/config';
</script>

<div class="w-full h-full">
	<Content>
		<Header back>Configuration</Header>
		<!-- {$message_layout} -->
		<button on:click={() => $message_layout = "comfy"}>go comfy</button>
		<button on:click={() => $message_layout = "compact"}>go compact</button>
	</Content>

</div>
