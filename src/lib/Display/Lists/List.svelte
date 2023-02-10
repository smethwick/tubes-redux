<script lang="ts">
	export let title: string = '';
    export let bg: string = "bg-purple-200"
</script>

<section class="not-prose">
	{#if title}
		<h4 class="text-sm font-bold px-1 mb-1 mt-2">{title}</h4>
	{/if}

	<ul class="{bg} rounded-xl overflow-clip divide-y text-black divide-black/25 divide-dotted ">
		<slot />
	</ul>
</section>

<style>
	h4 {
		font-variant: small-caps;
	}
</style>
