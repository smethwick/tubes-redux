<script>
	import PrimaryButton from '../Buttons/PrimaryButton.svelte';
</script>

<article
	class="w-full flex flex-col gap-2 place-items-center bg-neutral-200 border border-neutral-300 rounded-lg p-4"
>
	<h1 class="text-xl">You're not connected to this network</h1>
	<PrimaryButton
		colors={['bg-neutral-700', 'border-neutral-900', 'text-white']}
		class="text-sm"
		on:click
	>
		⚡ Connect
	</PrimaryButton>
</article>

<style>
	h1 {
		font-stretch: condensed;
	}
</style>
