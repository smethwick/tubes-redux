<script lang="ts">
	import ButtonBase from './ButtonBase.svelte';

	export let colors: [string, string, string] = [
		'bg-purple-700',
		'border-purple-900',
		'text-white'
	];

	let klass: string = '';
	export { klass as class };
</script>

<ButtonBase on:click class={klass} {colors}><slot /></ButtonBase>
