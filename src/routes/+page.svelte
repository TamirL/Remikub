<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { User } from '$lib/domain/user';

	let { data }: { data: User } = $props();
</script>

<div class="entry-page">
	<form method="POST" action="?/create-game">
		<label for="userName">User Name</label>
		<input type="text" name="userName" value={data.name} />
		<div>
			<Button type="submit">New Game</Button>

			OR
			<br />
			<label for="gameId">Existing Game Id</label>
			<input type="number" name="gameId" />
			<Button formaction="?/join-lobby">Join Game</Button>
		</div>
	</form>
</div>

<style>
	.entry-page {
		color: white;
	}

	input {
		color: black;
	}
</style>
