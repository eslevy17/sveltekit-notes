<script>
    import moon from "$lib/icons/moon.svg";
    import sun from "$lib/icons/sun.svg";
    import { flip } from 'svelte/animate';

    export let handleDarkThemeToggle;
    export let isDark;
</script>

<label class="switch-container">
    <button on:click={() => {
        handleDarkThemeToggle()
        isDark = !isDark
    }}>
        Toggle Dark Theme
    </button>

    {#each [1] as img (img)}
        <!-- need a keyed each block for animate:flip -->
        <img
            src="{isDark ? moon : sun}"
            alt="{isDark ? 'moon' : 'sun'}"
            class:dark={isDark}
            animate:flip
        />
    {/each}
</label>

<style>
    .switch-container {
        display: flex;
        align-items: center;
        height: 1.3rem;
        width: 2.4rem;
        border: 1px solid var(--font-color);
        border-radius: 1rem;
        margin: .5rem;
        cursor: pointer;
        opacity: .5;
        transition: opacity var(--animation-speed);
    }

    .switch-container:hover {
        opacity: .7;
    }

    img {
        height: 1rem;
        margin: 0 .2rem 0 auto;
    }

    img.dark {
        margin: 0 auto 0 .2rem;
    }

    button {
        display: none;
    }
</style>
