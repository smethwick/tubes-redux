<script lang="ts">
	export let id: string;
</script>

<h2 id={id} class="p-2 text-2xl font-regular capitalize mt-1"><slot /></h2>

<style>
	h2 {
		font-stretch: condensed;
	}
</style>
