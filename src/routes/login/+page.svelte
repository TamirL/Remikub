<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { loggedInUser } from '$lib/stores/user.svelte';
	import type { SubmitFunction } from './$types';

	const submitFunction: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type !== 'success' || !result.data) {
				update();
				return;
			}

			loggedInUser.user = result.data.user ?? null;
			goto(result.data.redirectUrl ?? '/');
		};
	};
</script>

<div class="page-size-wrapper">
	<form method="POST" use:enhance={submitFunction}>
		<label for="name">Name</label>
		<input name="name" />
		<Button type="submit">Log in</Button>
	</form>
</div>

<style>
	.page-size-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
	}

	input {
		color: black;
	}
</style>
