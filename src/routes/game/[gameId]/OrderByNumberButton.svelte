<script lang="ts">
	import { getGameContext } from '$lib/domain/game';
	import Button from '$lib/components/Button.svelte';
	import type { ReorderUserCardsAction } from '$lib/domain/gameActions';

	const gameContext = getGameContext();

	async function orderByNumber() {
		const newOrder = gameContext.gameManager.getUserCardsIdsOrderdByValue();
		const requestBody: ReorderUserCardsAction = {
			cardIdsNewOrder: newOrder
		};

		await fetch(`/api/game/${gameContext.gameManager.gameId}/user-cards`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
	}
</script>

<Button onclick={orderByNumber}>333</Button>
