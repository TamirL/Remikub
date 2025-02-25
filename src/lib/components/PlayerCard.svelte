<script lang="ts">
	import type { User } from '$lib/domain/user';
	import { loggedInUser } from '$lib/stores/user.svelte';

	const { player, isItTheirTurn }: { player: User; isItTheirTurn?: boolean } = $props();
</script>

<span class={['player-card', isItTheirTurn && 'their-turn']}>
	<span class="name">{player.name} {loggedInUser.user?.id === player.id ? ' - You' : ''}</span>
</span>

<style>
	.player-card {
		display: inline-block;
		background-color: #333333;
		border-radius: 5px;
		padding: 6px;
		text-align: center;
		font-size: 12px;

		& .name {
			color: white;
		}

		&.their-turn {
			outline: 2px solid #e5ff00;
		}
	}
</style>
