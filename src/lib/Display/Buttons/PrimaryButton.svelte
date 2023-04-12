<script lang="ts">
	import ButtonBase from './ButtonBase.svelte';

	export let colors: [string, string, string?] = [
		'bg-purple-400',
		'text-black',
		'outline-purple-400'
	];
	export let disabled = false;
	export let kind: 'button' | 'reset' | 'submit' = 'button';

	let klass: string = '';
	export { klass as class, kind as type };
</script>

<ButtonBase
	on:click
	{disabled}
	class={klass}
	{colors}
	{kind}><slot /></ButtonBase
>
