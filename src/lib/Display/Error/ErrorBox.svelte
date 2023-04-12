<script lang="ts">
	import WarningOctagon from 'phosphor-svelte/lib/WarningOctagon';
</script>

<div class="rounded-md bg-rose-300 text-rose-950 p-4 flex gap-2 place-items-center">
	<WarningOctagon weight="fill" size={20} /><span><slot /></span>
</div>
