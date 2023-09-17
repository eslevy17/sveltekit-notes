<script>
    import house from '$lib/icons/house.svg';
    import Toggle from "$lib/components/Toggle.svelte";
    import {afterUpdate} from "svelte";
    import AddNewItemForm from "$lib/components/AddNewItemForm.svelte";
    import ItemLine from "$lib/components/ItemLine.svelte";
    import ItemSearch from "$lib/components/ItemSearch.svelte";
    import { fade } from 'svelte/transition';

    export let data;

    function handleDarkThemeToggle() {
        document.querySelector('body').classList.toggle('dark')
    }

    function checkIsDark() {
        document.querySelector('body').classList.contains('dark')
    }

    afterUpdate(() => {
        if (collectionIDToEdit
            && document.querySelector('input[name="collection-search-field"]') !== document.activeElement
        ) {
            document.querySelector('form[name="collection-edit-form"] input[type="text"]').focus()
        }
    })

    let collectionIDToEdit;
    let isAdding = false;
    let searchTerms;

    let urlParams;

    $: urlParams = {
        collectionID: data.pathname.split('/')[1],
        noteID: data.pathname.split('/')[2]
    }
</script>

<div class="grid-layout">
    <nav>
        <a href="/" class="site-title">
            <img src="{house}" alt="house" />
            <h3>SvelteKit Notes!</h3>
        </a>
        <Toggle {handleDarkThemeToggle} isDark="{checkIsDark}"/>
    </nav>
    <div class="all-collections-list">
        {#if !data.collections.length}
            <p class="helper-text">No collections yet</p>
        {:else}
            <ItemSearch
                itemType="collection"
                {searchTerms}
                setSearchTerms={e => {
                    // e can be undefined if the form is reset()
                    searchTerms = e?.target?.value
                }}
                setIsAdding={newVal => isAdding = newVal}
            />
        {/if}

        <ul>
            {#each data.collections.filter(collection => !searchTerms || collection.title.toLowerCase().includes(searchTerms?.toLowerCase())) as collection (collection.id)}
                <ItemLine
                    itemType="collection"
                    itemID={collection.id}
                    itemTitle={collection.title}

                    parentCollectionID={null}

                    isSelected={collection.id === urlParams.collectionID}
                    isEditing={collectionIDToEdit === collection.id}

                    setItemIDToEdit={newVal => collectionIDToEdit = newVal}
                    setIsAdding={newVal => isAdding = newVal}
                />
            {/each}

            <AddNewItemForm
                formActionURL="/collectionID?/create"
                {isAdding}
                setIsAdding={newVal => isAdding = newVal}
                setItemIDToEdit={newVal => collectionIDToEdit = newVal}
            />
        </ul>
    </div>

    <div class="collection-details-slot">
        {#key urlParams.collectionID}
            <span
                in:fade={{duration: 200, delay: 100}}
                out:fade={{duration: 100}}
            >
                <slot />
            </span>
        {/key}
    </div>
</div>

<style>
    .grid-layout {
        height: 100vh;
        transition: background-color var(--animation-speed);
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr 3fr;
        grid-template-areas:
            "header header"
            "all-collections collection-details";
    }

    .site-title {
        display: flex;
        align-items: center;
        gap: .5rem;
        opacity: .7;
        padding: 0;
        transition: opacity var(--animation-speed);
    }

    .site-title:hover {
        opacity: 1;
    }

    .site-title img {
        opacity: 1; /* to override the regular img {} selector */
        height: 1.5rem;
        width: 1.5rem;
    }

    .site-title h3 {
        margin: 0;
    }

    nav {
        background-color: var(--bg-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .5rem 1rem;
        border-bottom: 1px solid var(--border-color);
        grid-area: header;
        transition:
            border var(--animation-speed),
            background-color var(--animation-speed)
        ;
    }

    .all-collections-list {
        grid-area: all-collections;
        background-color: var(--bg-color-dark);
        padding: 0 1.25rem;
        border-right: 1px solid var(--border-color);
        height: 100%;
        transition:
            border var(--animation-speed),
            background-color var(--animation-speed)
        ;
    }

    .collection-details-slot {
        grid-area: collection-details;
        background-color: var(--bg-color-xx-dark);
        transition: background-color var(--animation-speed);
    }

    .helper-text {
        font-size: .75rem;
        font-style: italic;
        opacity: .75;
        margin-top: 1rem;
    }
</style>
