<script lang="ts">
	export let key: string;

	let json = JSON.parse(localStorage.getItem('dismissed') ?? '{}');
	let dismissed = json[key];

	const get_json = () => {
		json = JSON.parse(localStorage.getItem('dismissed') ?? '{}');
	}

	if (typeof dismissed !== 'boolean') {
		get_json();
		dismissed = false;
		localStorage.setItem('dismissed', JSON.stringify({ ...json, [key]: false }));
	}

	const dismiss = () => {
		get_json();
		localStorage.setItem('dismissed', JSON.stringify({ ...json, [key]: true }));
		dismissed = true;
	};
</script>

{#if !dismissed}
    <slot {dismiss} />
{/if}