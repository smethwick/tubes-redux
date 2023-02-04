<script lang="ts">
	export let id: string;
</script>

<h2 id={id} class="p-2 text-2xl font-medium capitalize mt-2"><slot /></h2>

<style>
	h2 {
		font-stretch: extra-condensed;
	}
</style>
