<script lang="ts">
	import { message_layout } from '$lib/Things/config';
	let klass: string = '';
	export { klass as class };
</script>

<p
	class="flex {$message_layout == 'comfy'
		? 'flex-col justify-start place-items-start px-4 py-1'
		: 'place-items-center gap-3 py-0.5'} rounded {klass}"
>
	<span
		class="{$message_layout == 'comfy'
		? 'text-sm'
		: 'w-28 min-w-[6rem] '} text-right font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap"
	>
		<slot name="sender" />
	</span>
	<slot name="content" />
</p>

<style>
	p {
		word-break: break-all;
	}
</style>
