<script lang="ts">
	import type { CardSlotData } from '../../domain/board';
	import Card from './Card.svelte';
	import DragabbleCard from './DragabbleCard.svelte';

	const { slot, highlight }: { slot: CardSlotData; highlight: boolean } = $props();
</script>

{#if slot.card}
	<div class={highlight ? 'highlighted' : ''}>
		<DragabbleCard cardData={slot.card} />
	</div>
{:else}
	<div class={highlight ? 'highlighted' : ''} style:opacity={0.2}>
		<Card cardData={slot.expectedCard} />
	</div>
{/if}

<style>
	.highlighted {
		border: 2px solid yellow;
	}
</style>
