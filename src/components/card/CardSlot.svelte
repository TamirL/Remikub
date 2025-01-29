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
	<div class={highlight ? 'highlighted' : ''}>
		<div style:opacity={0.2}>
			<Card cardData={slot.expectedCard} />
		</div>
	</div>
{/if}

<style>
	.highlighted {
		outline: 2px solid rgba(255, 255, 0, 0);
		animation: glow 1.5s ease-in-out infinite alternate;
	}

	@keyframes glow {
		from {
			outline-color: rgba(255, 255, 0, 0.5);
		}
		to {
			outline-color: rgba(255, 255, 0, 1);
		}
	}
</style>
