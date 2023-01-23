<script lang="ts">
	import ButtonBase from './ButtonBase.svelte';

	export let colors: [string, string, string] = ['bg-black/20', 'border-black/30', 'text-black'];
	let klass: string = '';
	export { klass as class };
</script>

<ButtonBase on:click class={klass} {colors}><slot /></ButtonBase>
