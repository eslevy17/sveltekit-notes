<script lang="ts">
    import { enhance } from '$app/forms';
    import add from '$lib/icons/add.svg';
    import edit from '$lib/icons/edit.svg';
    import revert from '$lib/icons/revert.svg';
    import trash from '$lib/icons/trash.svg';
    import save from '$lib/icons/save.svg';
    import Toggle from "$lib/components/Toggle.svelte";

    export let data;

    function handleDarkThemeToggle() {
        document.querySelector('body').classList.toggle('dark')
    }

    function checkIsDark() {
        document.querySelector('body').classList.contains('dark')
    }

    let collectionIDToEdit;
</script>

<div class="grid-layout">
    <div class="all-collections-list">
        <h3>Notes</h3>
        <ul>
            {#each data.collections as collection (collection)}
                <li class="collection-details">
                    {#if collection.id !== collectionIDToEdit}
                        <div class="note-interior">
                            <a href="/{collection.id}">
                                {collection.title}
                            </a>
                            <label>
                                <img src="{edit}" alt="edit" />
                                <button on:click={() => collectionIDToEdit = collection.id}>Edit</button>
                            </label>
                        </div>
                    {:else}
                        <form
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
                            <input type="text" name="title" value="{collection.title}" />

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

            <li>
                <p class="add-new"><i>Add new:</i></p>
                <form
                    class="add-new-form"
                    method="POST"
                    action="/collectionID?/create"
                    use:enhance
                >
                    <input type="text" name="title" />

                    <label>
                        <img src="{add}" alt="add" />
                        <input type="submit" value="Submit" />
                    </label>

                    <label>
                        <img src="{revert}" alt="revert" />
                        <input type="reset" name="reset" />
                    </label>
                </form>
            </li>
        </ul>
    </div>

    <div>
        <slot />
    </div>
</div>

<style>
    .grid-layout {
        background-color: var(--bg-color);
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: 100vh;
    }

    .all-collections-list {
        padding: 0 1.25rem;
        border-right: 1px solid var(--border-color);
    }

    .collection-details {
        display: grid;
        grid-template-columns: auto 1rem;
        align-items: center;
    }

    .note-interior {
        width: 100%;
        display: grid;
        grid-template-columns: auto 1rem 1rem;
    }

    .collection-edit-form {
        display: grid;
        grid-template-columns: auto 2rem 1rem 1rem;
    }

    .add-new-form {
        display: grid;
        grid-template-columns: auto 2rem 1rem 2rem;
    }

    .add-new {
        font-size: .75rem;
        opacity: .75;
        margin-top: .5rem;
    }

    label img {
        cursor: pointer;
        height: 1rem;
        opacity: .7;
    }

    label img:hover {
        opacity: 1;
    }

    label button,
    label input {
        display: none;
    }
</style>
