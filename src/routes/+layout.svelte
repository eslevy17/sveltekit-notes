<script>
    import { enhance } from '$app/forms';
    import edit from '$lib/icons/edit.svg';
    import folder from '$lib/icons/folder.svg';
    import house from '$lib/icons/house.svg';
    import revert from '$lib/icons/revert.svg';
    import trash from '$lib/icons/trash.svg';
    import save from '$lib/icons/save.svg';
    import Toggle from "$lib/components/Toggle.svelte";
    import {afterUpdate} from "svelte";
    import { page } from '$app/stores';
    import AddNewItemForm from "$lib/components/AddNewItemForm.svelte";

    export let data;

    function handleDarkThemeToggle() {
        document.querySelector('body').classList.toggle('dark')
    }

    function checkIsDark() {
        document.querySelector('body').classList.contains('dark')
    }

    afterUpdate(() => {
        if (collectionIDToEdit) {
            document.querySelector('form[name="collection-edit-form"] input[type="text"]').focus()
        }
    })

    let collectionIDToEdit;
    let isAdding = false;

    let urlParams;

    $: {
        urlParams = {
            collectionID: $page.url.pathname.split('/')[1],
            noteID: $page.url.pathname.split('/')[2]
        }
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
        {/if}

        <ul>
            {#each data.collections as collection (collection)}
                <li class="collection-details" class:isSelected={collection.id === urlParams.collectionID}>
                    <img src="{folder}" alt="folder" />
                    {#if collection.id !== collectionIDToEdit}
                        <div class="note-interior">
                            <a href="/{collection.id}">
                                {collection.title}
                            </a>
                            <label>
                                <img src="{edit}" alt="edit" />
                                <button
                                    on:click={() => {
                                        collectionIDToEdit = collection.id
                                        isAdding = false
                                    }}
                                >Edit</button>
                            </label>
                        </div>
                    {:else}
                        <form
                            name="collection-edit-form"
                            class="collection-edit-form"
                            method="POST"
                            action="/{collection.id}?/update"
                            use:enhance={() => {
                                return async ({ update }) => {
                                    await update()
                                    collectionIDToEdit = undefined
                                }
                            }}
                        >
                            <input
                                type="text"
                                name="title"
                                value="{collection.title}"
                                on:keydown={e => {
                                    if (e.key === 'Escape') {
                                        collectionIDToEdit = undefined
                                    }
                                }}
                            />

                            <label>
                                <img src="{save}" alt="save" />
                                <input type="submit" value="Submit" />
                            </label>

                            <label>
                                <img src="{revert}" alt="revert" />
                                <button on:click={() => collectionIDToEdit = undefined}>Revert</button>
                            </label>
                        </form>
                        <form
                            method="POST"
                            action="/{collection.id}?/delete"
                            use:enhance={({ cancel }) => {
                                if (!confirm(
                                    'Are you sure you wish to delete this collection?'
                                    + `\n\n"${collection.title}"`
                                )) cancel()

                                return async ({ update }) => {
                                    await update()
                                    collectionIDToEdit = undefined
                                }
                            }}
                        >
                            <label>
                                <img src="{trash}" alt="delete" />
                                <input type="Submit" value="Delete" />
                            </label>
                        </form>
                    {/if}
                </li>
            {/each}

            <AddNewItemForm
                formActionURL="/collectionID?/create"
                {isAdding}
                setIsAdding={newVal => isAdding = newVal}
                setItemIDToEdit={newVal => collectionIDToEdit = newVal}
            />
        </ul>
    </div>

    <div class="note-details-slot">
        <slot />
    </div>
</div>

<style>
    .grid-layout {
        height: 100vh;
        background-color: var(--bg-color);
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr 3fr;
        grid-template-areas:
            "header header"
            "note-collection note-details";
    }

    .site-title {
        display: flex;
        align-items: center;
        gap: .5rem;
        opacity: .7;
        padding: 0;
    }

    .site-title:hover {
        opacity: 1;
    }

    .site-title img {
        opacity: 1; /* to override the regular img {} selector */
        height: 1.5rem;
    }

    .site-title h3 {
        margin: 0;
    }

    nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .5rem 1rem;
        border-bottom: 1px solid var(--border-color);
        grid-area: header;
    }

    .all-collections-list {
        grid-area: note-collection;
        padding: 0 1.25rem;
        border-right: 1px solid var(--border-color);
        height: 100%;
    }

    .note-details-slot {
        grid-area: note-details;
    }

    .collection-details {
        display: grid;
        grid-template-columns: 1rem auto 1rem;
        align-items: center;
        padding-left: .5rem;
    }

    .collection-details:hover {
        background-color: var(--bg-hover-color);
    }

    .collection-details.isSelected {
        background-color: var(--bg-hover-color);
    }

    .note-interior {
        width: 100%;
        display: grid;
        grid-template-columns: auto 1rem 1rem;
        align-items: center;
    }

    .collection-edit-form {
        display: grid;
        grid-template-columns: auto 1rem 1rem;
        grid-gap: 1rem;
        align-items: center;
        margin-right: 1rem;
    }

    .helper-text {
        font-size: .75rem;
        font-style: italic;
        opacity: .75;
        margin-top: 1rem;
    }

    img {
        cursor: pointer;
        height: 1rem;
        opacity: .7;
    }

    img:hover {
        opacity: 1;
    }

    label button,
    label input {
        display: none;
    }
</style>
