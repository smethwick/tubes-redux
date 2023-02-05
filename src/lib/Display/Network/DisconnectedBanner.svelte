<script lang="ts">
	import PrimaryButton from '../Buttons/PrimaryButton.svelte';
	export let color: string;
</script>

<article
	class="w-full h-[60vh] flex flex-col gap-2 place-items-center justify-center 
	bg-{color}-200 rounded-lg px-4 py-2"
>
	<h1 class="text-xl">you aren't connected to this network</h1>
	<PrimaryButton
		colors={[`bg-${color}-400`, 'text-black', `outline-${color}-400`]}
		class="text-sm"
		on:click
	>
		Connect!
	</PrimaryButton>
</article>

<style>
	h1 {
		font-stretch: expanded;
	}
</style>
