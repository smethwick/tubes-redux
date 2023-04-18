<script lang="ts">
	import type { IrcConnection } from '$lib/Chat/provider+connection';

	export let conn: IrcConnection;
	const isConnected = conn.isConnected;
	const connection_info = conn.connection_info;
</script>

<header class="mb-6">
	<p>
		{(() => {
			switch ($isConnected) {
				case true:
					return 'connected to';
				case 'connecting':
					return 'connecting…';
				case false:
					return 'disconnected from';
			}
		})()}
	</p>
	<h1>{connection_info.display_name ?? connection_info.name}</h1>
</header>

<style>
	h1 {
		@apply text-4xl;
		font-stretch: extra-condensed;
	}
</style>
