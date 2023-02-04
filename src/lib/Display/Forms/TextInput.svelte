<script lang="ts">
	export let placeholder = '',
		value = '';
	export let type: 'text' | 'email' | 'password' = 'text';

	let klass = '';

	function typeAction(node: HTMLInputElement) {
		node.type = type;
	}

	export { klass as class };
</script>

<label class="flex flex-col gap-2">
	<div class="prose prose-sm">
		<slot />
	</div>
	<input
		bind:value
		use:typeAction
		class="w-full mt-auto 
		border-black border-0 border-b border-dashed 
		focus-visible:border-purple-500
		{klass}"
		{placeholder}
	/>
</label>
