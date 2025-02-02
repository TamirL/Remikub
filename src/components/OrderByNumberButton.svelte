<script lang="ts">
	import { getGameContext } from '../domain/game';
	import Button from '$lib/Button.svelte';

	const gameContext = getGameContext();

	function orderByNumber() {
		gameContext.userCardsManager.orderByValue();
	}
</script>

<Button onclick={orderByNumber}>333</Button>
