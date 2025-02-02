<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const props: HTMLButtonAttributes = $props();
</script>

<button {...props}> {@render props.children?.()}</button>

<style>
	button {
		background-color: #0033dd;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		margin: 10px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
