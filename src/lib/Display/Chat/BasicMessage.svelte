<script lang="ts">
	let klass: string = '';
	export { klass as class };
</script>

<p class="flex place-items-center gap-3 hover:bg-neutral-100 rounded py-0.5 {klass}">
	<span class="w-28 min-w-[6rem] text-right font-semibold"><slot name="sender" /></span>
	<slot name="content" />
</p>

<style>
    p {
        word-break: break-all;
    }
</style>