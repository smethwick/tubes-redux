<script lang="ts">
	export let value = false;
	let klass = '';

	export { klass as class };
</script>

<label class="flex place-items-center gap-3">
	<input
		bind:value
		type="checkbox"
		class="rounded text-purple-500 focus:outline-purple-500 {klass}"
	/>
	<div class="prose prose-sm select-none">
		<slot />
	</div>
</label>
