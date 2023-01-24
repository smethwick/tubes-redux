<script lang="ts">
	export let colors: [string, string];
	let klass: string = '';
	export { klass as class };
</script>

<button on:click class="{colors.join(' ')} {klass} px-4 py-1.5 rounded-full">
	<slot />
</button>
