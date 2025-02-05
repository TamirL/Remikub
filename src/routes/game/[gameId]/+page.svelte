<script lang="ts">
	import { setCardSizeContext } from '$lib/domain/card';
	import type { GameFromPlayerPerspective } from '$lib/domain/game';
	import Game from './Game.svelte';

	const widthInPixels = 40;
	setCardSizeContext({
		width: `${widthInPixels}px`,
		height: `${widthInPixels * 1.41}px`
	});

	const { data }: { data: GameFromPlayerPerspective } = $props();
</script>

<Game game={data} />
