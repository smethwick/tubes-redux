<script lang="ts">
	import {
		default_config,
		default_icons,
		type ConnectionInfo
	} from '$lib/Chat/provider+connection';
	import { saveMessage } from '$lib/Storage/messages';
	import { provider } from '$lib/Chat';
	import { v4 as uuidv4 } from 'uuid';

	const addProvider = async () => {
		const uuid = uuidv4();
		let ci: ConnectionInfo = {
			...default_config,
			name: uuid,
			display_name: 'Ergo Testnet',
			icon: default_icons[Math.floor(Math.random() * default_icons.length)],
			url: 'wss://testnet.ergo.chat/webirc',
			autojoin: ['#tubes', '#tubes/test', '#testaaaa']
		};

		let conn = provider.add_persistent_connection(ci);
		conn.on_msg = e => saveMessage(ci.name, e);
	};
</script>

todo

<button on:click={() => addProvider()}>new all</button>