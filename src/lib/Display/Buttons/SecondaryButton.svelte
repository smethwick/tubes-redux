<script lang="ts">
	import ButtonBase from './ButtonBase.svelte';

	export let colors: [string, string, string?] = ['bg-purple-200', 'text-black', 'outline-purple-200'];
	let klass: string = '';
	export { klass as class };
</script>

<ButtonBase on:click class={klass} {colors}><slot /></ButtonBase>
