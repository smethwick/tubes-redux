<script lang="ts">
	import type { MessageGroup } from '$lib/Chat/groups';
	import BasicMessage from '$lib/Display/Chat/BasicMessage.svelte';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import HandWaving from 'phosphor-svelte/lib/HandWaving';
	import { quadOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	export let group: MessageGroup;

	$: opened = false;
</script>

{#if group.messages.length == 1}
	<MessageView msg={group.messages[0]} />
{:else}
	<BasicMessage class="text-sm hover:bg-neutral-50 place-items-center">
		<span
			class="text-purple-700 font-bold flex justify-end place-items-center"
			aria-hidden
			slot="sender"
		>
			<HandWaving weight="bold" />
		</span>
		<svelte:fragment slot="content">
			{group.summarise()}
			<button class="underline" on:click={() => (opened = !opened)}>
				{opened ? 'ensmallen' : 'embiggen'}
			</button>
		</svelte:fragment>
	</BasicMessage>
	{#if opened}
		<div transition:slide={{ duration: 150, easing: quadOut }}>
			{#each group.messages as msg (msg.id)}
				<div><MessageView {msg} /></div>
			{/each}
		</div>
	{/if}
{/if}
