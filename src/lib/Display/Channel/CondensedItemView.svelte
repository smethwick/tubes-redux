<script lang="ts">
	import MessageView from '../Chat/MessageView.svelte';
	import MessageGroupView from './MessageGroupView.svelte';
	import {
		comp_adapter_schema,
		message_group_schema,
		type CondensedTypes
	} from './condense';

	export let item: CondensedTypes<unknown>;

	const component = comp_adapter_schema.safeParse(item);
	const group = message_group_schema.safeParse(item);
</script>

{#if component.success}
	<svelte:component this={component.data.comp} params={component.data.params} />
    {:else if group.success}
	<MessageGroupView group={group.data} />
    {:else}
    <MessageView msg={item} />
{/if}
