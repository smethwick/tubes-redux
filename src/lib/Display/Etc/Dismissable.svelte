<script lang="ts">
	export let key: string;

	const json = JSON.parse(localStorage.getItem('dismissed') ?? '{}');
	let dismissed = json[key];

	if (typeof dismissed !== 'boolean') {
		dismissed = false;
		localStorage.setItem('dismissed', JSON.stringify({ ...json, [key]: false }));
	}

	const dismiss = () => {
		localStorage.setItem('dismissed', JSON.stringify({ ...json, [key]: true }));
		dismissed = true;
	};
</script>

{#if !dismissed}
    <slot {dismiss} />
{/if}