<script lang="ts">
	import { getGameContext } from '$lib/domain/game';
	import Button from '$lib/components/Button.svelte';

	const gameContext = getGameContext();

	function orderByColor() {
		gameContext.userCardsManager.orderByColor();
	}
</script>

<Button onclick={orderByColor}>123</Button>
