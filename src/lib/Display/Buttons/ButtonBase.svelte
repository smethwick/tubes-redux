<script lang="ts">
	export let colors: [string, string, string?];
	let klass: string = '';
	export let disabled = false;
	export let kind: 'button' | 'reset' | 'submit' = 'button';
	export { klass as class };
</script>

<button
	on:click
	class="
		{colors.join(' ')} 
		{disabled ? `${klass} cursor-not-allowed opacity-75` : klass} 
		rounded-full px-4 py-1.5
		{colors[2] ? `outline-2 outline-offset-2 focus-visible:outline ${colors[2]}` : ''}
	"
	{disabled}
	type={kind}
>
	<slot />
</button>
