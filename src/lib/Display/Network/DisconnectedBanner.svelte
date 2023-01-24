<script>
	import PrimaryButton from '../Buttons/PrimaryButton.svelte';
</script>

<article
	class="w-full flex gap-2 place-items-center 
	bg-pink-200 rounded-lg px-4 py-2"
>
	<h1 class="text-lg">you aren't connected to this network</h1>
	<PrimaryButton
		colors={['bg-pink-400', 'text-black', "outline-pink-400"]}
		class="text-sm ml-auto"
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
