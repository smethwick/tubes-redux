<script lang="ts">
	import { current_style } from '$lib/Chat';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import User from 'phosphor-svelte/lib/User';
	export let conn: IrcConnection;

	const style = $current_style.color_name;
</script>

<div class="flex place-items-center gap-2 bg-{style}-200 px-4 py-2 rounded-lg">
	<User /> Logged in as {conn.nick}
</div>
