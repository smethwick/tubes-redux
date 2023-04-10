<script lang="ts">
	import CaretUp from 'phosphor-svelte/lib/CaretUp';
</script>

<div class="flex place-items-center gap-2">
	<div class="separator" />
	<button
		class="flex min-w-max place-items-center gap-2 rounded-md px-2 py-1 text-sm
        text-neutral-700 transition-colors duration-100 hover:bg-neutral-100"
        on:click
	>
		<CaretUp />Load More
	</button>
	<div class="separator" />
</div>

<style>
	.separator {
		@apply h-[1px] w-full bg-neutral-300;
	}
</style>
