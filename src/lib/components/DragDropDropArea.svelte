<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		disableDragDrop,
        isAnyElementDragged,
		onElementDropped,
		content
	}: {
		disableDragDrop?: boolean;
        isAnyElementDragged: boolean;
		onElementDropped(): void;
		content: Snippet<[isDragOver: boolean]>;
	} = $props();

	let isOtherElementDraggedOverThis = $state(false);

	$inspect(isOtherElementDraggedOverThis);

	function handleDragEnter(event: DragEvent) {
		if (disableDragDrop) {
			return;
		}

		event.preventDefault();
		isOtherElementDraggedOverThis = true;
	}

	function handleDragLeave(event: DragEvent) {
		if (disableDragDrop) {
			event.preventDefault();
		}

		isOtherElementDraggedOverThis = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isOtherElementDraggedOverThis = false;
		onElementDropped();
	}
</script>

<div
	role="region"
	aria-label="Drop zone for card"
	ondragenter={handleDragEnter}
	ondrop={handleDrop}
	ondragleave={handleDragLeave}
	ondragover={(ev) => {
		if (disableDragDrop) return;
		ev.preventDefault();
	}}
>
	<div class={isAnyElementDragged ? 'is-any-card-dragged' : ''}>
		{@render content(isOtherElementDraggedOverThis)}
	</div>
</div>

<style>
	/* When any card is being dragged, we disable pointer events on all cards to prevent
	   the dragenter/dragleave events from firing on the cards themselves instead of their containers.
	   This ensures drag & drop works reliably when hovering over existing cards. */
	.is-any-card-dragged {
		pointer-events: none;
	}
</style>
