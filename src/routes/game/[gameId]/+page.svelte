<script lang="ts">
	import { setCardSizeContext } from '$lib/domain/cards';
	import { setGameContext, type GameFromPlayerPerspective } from '$lib/domain/game';
	import GameManager from '$lib/domain/managers/gameManager.svelte';
	import UpdateManager from '$lib/domain/managers/updateManager.svelte';
	import Game from './Game.svelte';
	import { browser } from '$app/environment';

	const widthInPixels = 40;
	setCardSizeContext({
		width: `${widthInPixels}px`,
		height: `${widthInPixels * 1.41}px`
	});

	const { data }: { data: GameFromPlayerPerspective } = $props();

	let updatesEventSource: EventSource | null = null;

	if (browser) {
		// updatesEventSource = new EventSource(`/api/game/${data.id}/updates`);
		setTimeout(async () => {
			const response = await fetch(`/api/game/${data.id}/updates`);

			if (response.body === null) {
				console.error('No body');
				return;
			}

			const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			while (true) {
				console.log('reading');
				const { value, done } = await reader.read();
				console.log('resp', done, value);
				if (done) break;
			}
		});
	}

	const gameManager = $state(new GameManager(new UpdateManager(data, updatesEventSource)));

	setGameContext({ gameManager });
</script>

<Game />
