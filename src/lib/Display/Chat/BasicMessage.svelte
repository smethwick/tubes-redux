<script lang="ts">
	let klass: string = '';
	export { klass as class };
</script>

<p class="flex gap-3 {klass}">
	<span class="w-24 min-w-[6rem] text-right font-semibold"><slot name="sender" /></span>
	<slot name="content" />
</p>

<style>
    p {
        word-break: break-all;
    }
</style>