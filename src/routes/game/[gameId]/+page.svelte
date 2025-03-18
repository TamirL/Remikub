<script lang="ts">
	import { cardSizeContext } from '$lib/domain/cards';
	import { setGameContext, type GameFromPlayerPerspective } from '$lib/domain/game';
	import GameManager from '$lib/domain/managers/gameManager.svelte';
	import UpdateManager from '$lib/domain/managers/updateManager.svelte';
	import Game from './Game.svelte';
	import { browser } from '$app/environment';
	import { source, type Source } from 'sveltekit-sse';

	const widthInPixels = 40;
	const heightInPixels = widthInPixels * 1.41;
	cardSizeContext.init({
		widthPx: widthInPixels,
		width: `${widthInPixels}px`,
		heightPx: heightInPixels,
		height: `${heightInPixels}px`
	});

	const { data }: { data: GameFromPlayerPerspective } = $props();

	let updatesEventSource: Source | null = null;

	if (browser) {
		updatesEventSource = source(`/api/game/${data.id}/updates`);
	}

	const gameManager = $state(new GameManager(new UpdateManager(data, updatesEventSource)));

	setGameContext({ gameManager });
</script>

<Game />
