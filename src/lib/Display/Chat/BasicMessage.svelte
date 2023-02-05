<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	let klass: string = '';
	export { klass as class };
</script>

<p
	class="flex {$message_layout == 'comfy'
		? 'flex-col justify-start place-items-start px-4 py-1 my-1'
		: 'place-items-start gap-3 py-0.5 my-0.5'} rounded {klass}"
>
	<span
		class="{$message_layout == 'comfy'
		? 'text-sm'
		: 'w-32 min-w-[8rem] '} text-right font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap"
	>
		<slot name="sender" />
	</span>
	<span class="w-full"><slot name="content" /></span>
</p>

<style>
	p {
		word-break: break-all;
	}
</style>
