<script lang="ts">
	import type { CardSlotData } from '../domain/board';
	import Card from './card/Card.svelte';

	const { slot, highlight }: { slot: CardSlotData; highlight: boolean } = $props();
</script>

<div class={highlight ? 'highlighted' : ''} style:opacity={slot.card ? 1 : 0.2}>
	<Card cardData={slot.card ?? slot.expectedCard} />
</div>

<style>
	.highlighted {
		border: 2px solid yellow;
	}
</style>
