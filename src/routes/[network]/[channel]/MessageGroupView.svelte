<script lang="ts">
	import type { MessageGroup } from '$lib/Chat/groups';
	import MessageTemplate from '$lib/Display/Chat/MessageTemplate.svelte';
	import MessageView from '$lib/Display/Chat/MessageView.svelte';
	import HandWaving from 'phosphor-svelte/lib/HandWaving';
	import { quadOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	export let group: MessageGroup;

	$: opened = false;

	const toggle = () => {
		opened = !opened;
	};
</script>

{#if group.messages.length == 1}
	<MessageView msg={group.messages[0]} />
{:else}
	<MessageTemplate class="text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 place-items-center">
		<span
			class="text-purple-700 font-bold flex justify-end place-items-center"
			aria-hidden
			slot="sender"
		>
			<HandWaving weight="bold" />
		</span>
		<svelte:fragment slot="content">
			{group.summarise()}
			<button class="underline" on:click={toggle}>
				{opened ? 'ensmallen' : 'embiggen'}
			</button>
		</svelte:fragment>		
		<div slot="after">
		{#if opened}
			<div class="ml-6" transition:slide={{ duration: 150, easing: quadOut }}>
				{#each group.messages as msg}
					<div><MessageView {msg} /></div>
				{/each}
			</div>
		{/if}
		</div>
	</MessageTemplate>
{/if}
