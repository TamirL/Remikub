<script lang="ts">
	import { setCardSizeContext } from '$lib/domain/card';
	import Game from './Game.svelte';

	setCardSizeContext({
		width: '40px',
		height: '60px'
	});
</script>

<Game />
