<script>
	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import { Eye, EyeOff, Loader2 } from 'lucide-svelte';

	let showPassword = false;
	let loading = false;

	function handleSubmit({ formElement, formData, action, cancel }) {
		loading = true;

		return async ({ result, update }) => {
			loading = false;

			if (result.type === 'redirect') {
				await applyAction(result);
				return;
			}

			await update();
		};
	}

	$: errorMessage = $page.form?.error ?? '';
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4">
	<div class="w-full max-w-sm">
		<!-- Heading -->
		<h1 class="mb-6 text-4xl font-semibold tracking-tight text-foreground">Log In</h1>

		<!-- Error banner -->
		{#if errorMessage}
			<div
				class="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
				role="alert"
				aria-live="polite"
			>
				{errorMessage}
			</div>
		{/if}

		<form method="POST" use:enhance={handleSubmit} class="space-y-5" autocomplete="on">
			<!-- Email -->
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-foreground"> Email </label>
				<input
					type="email"
					id="email"
					name="email"
					autocomplete="email"
					spellcheck={false}
					required
					placeholder="you@example.com…"
					class="block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
				/>
			</div>

			<!-- Password -->
			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-foreground">
					Password
				</label>
				<div class="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						id="password"
						name="password"
						autocomplete="current-password"
						required
						placeholder="••••••••"
						class="block w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
					/>
					<button
						type="button"
						class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/20"
						on:click={() => (showPassword = !showPassword)}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						tabindex="-1"
					>
						{#if showPassword}
							<EyeOff class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</button>
				</div>
			</div>

			<!-- Submit -->
			<button
				type="submit"
				disabled={loading}
				class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
			>
				{#if loading}
					<Loader2 class="h-4 w-4 animate-spin" />
					<span>Signing in…</span>
				{:else}
					Sign In
				{/if}
			</button>
		</form>
	</div>
</div>

<style>
	* {
		touch-action: manipulation;
	}
</style>
