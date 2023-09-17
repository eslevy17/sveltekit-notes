<script>
    import search from '$lib/icons/search.svg';
    import clear from '$lib/icons/clear.svg';
    import { fade } from 'svelte/transition';

    export let itemType;
    export let searchTerms;
    export let setSearchTerms;
    export let setIsAdding;
</script>

<form
    class="search-line-form"
    on:reset={() => setSearchTerms(undefined)}
>
    <img src={search} alt="search" class="search-icon" />

    <input
        name={`${itemType}-search-field`}
        type="text"
        class="search-field"
        bind:value={searchTerms}
        on:keyup={e => {
            if (e.key === 'Escape') {
                e.target.value = ''
                e.target.blur()
            }
            setSearchTerms(e)
        }}
        on:focus={() => setIsAdding(false)}
    />

    {#if searchTerms}
        <label class="clear-icon" transition:fade>
            <img src={clear} alt="clear" />
            <input type="reset" name="reset" />
        </label>
    {/if}
</form>

<style>
    .search-line-form {
        margin-top: 1.25rem;
        display: grid;
        grid-template-columns: 1.5rem auto 0;
        align-items: center;
        width: calc(100% + .5rem)
    }

    input {
        margin: -1px 0;
        padding: 4px 7px;
        width: 100%;
        box-sizing: border-box;
        border-radius: 1rem;
    }

    img {
        opacity: .7;
    }



    .search-icon {
        margin-right: .5rem;
    }

    .clear-icon {
        opacity: .7;
        margin-left: -1.5rem;
        transition: opacity var(--animation-speed);
    }

    .clear-icon:hover {
        cursor: pointer;
        opacity: 1;
    }

    label input {
        display: none;
    }
</style>
