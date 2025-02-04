<script lang="ts">
	import { setCardSizeContext } from '$lib/domain/card';
	import type { GameFromPlayerPerspective } from '$lib/domain/game';
	import Game from './Game.svelte';

	setCardSizeContext({
		width: '40px',
		height: '60px'
	});

	const { data }: { data: GameFromPlayerPerspective } = $props();
</script>

<Game game={data} />
