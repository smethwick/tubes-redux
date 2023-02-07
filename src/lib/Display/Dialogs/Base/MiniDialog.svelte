<script lang="ts">
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import X from 'phosphor-svelte/lib/X';
	import { prevent_default } from 'svelte/internal';
	import Base from './Base.svelte';

	export let value: string = '';
	export let placeholder: string = "";
	export let isopen: boolean = false;
	export let title: string;

	let form: HTMLFormElement;
	let button: HTMLButtonElement;
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key == 'Escape') {
			e.preventDefault();
			isopen = false;
		}
	}}
/>

<Base bind:isopen let:close class="h-96">
	<span class="flex place-items-center gap-2">
		<button on:click={() => close()}><X /></button>
		<h2>{title}</h2>
	</span>

	<form class="flex mt-auto mb-4 gap-4 place-items-end" bind:this={form}>
		<p
			class="w-full text-2xl border-0 resize-none border-b border-dashed 
            border-neutral-700 pt-4 pb-2 break-all cursor-text"
			bind:textContent={value}
			aria-placeholder={placeholder}
			role="textbox"
			tabindex=0
			contenteditable
			data-placeholder={placeholder}
			on:keydown={(e) => {
				if (e.key == 'Enter') {
					e.preventDefault();
					button.click();
					return false;
				}
			}}
		/>

		<button
			class="w-20 h-20 aspect-square flex place-items-center justify-center
            bg-purple-300 rounded-full"
			type="submit"
			on:click
			bind:this={button}
		>
			<span class="-ml-0.5">
				<ArrowRight weight="light" size={32} />
			</span>
		</button>
	</form>
	<span class="text-sm select-none">
		<slot name="bit at the bottom" />
	</span>
</Base>

<style>
	:global([data-placeholder]:empty:before) {
		content: attr(data-placeholder);
		cursor: text;
		color: theme("colors.neutral.400");
	}
</style>
