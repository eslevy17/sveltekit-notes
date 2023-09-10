<script lang="ts">
    import { enhance } from '$app/forms';
    import add from '$lib/icons/add.svg';
    import edit from '$lib/icons/edit.svg';
    import revert from '$lib/icons/revert.svg';
    import trash from '$lib/icons/trash.svg';
    import save from '$lib/icons/save.svg';

    export let data;

    let collectionIDToEdit;
</script>

<div class="grid-layout">
    <div>
        <h1>Notes</h1>
        <ul>
            {#each data.collections as collection (collection)}
                <li>
                    {#if collection.id !== collectionIDToEdit}
                        <a href="/{collection.id}">
                            {collection.title}
                        </a>
                        <label>
                            <img src="{edit}" alt="edit" />
                            <button on:click={() => collectionIDToEdit = collection.id}>Edit</button>
                        </label>
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
                    {:else}
                        <form
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
                    {/if}
                </li>
            {/each}

            <li>
                <form method="POST" action="/collectionID?/create" use:enhance>
                    <input type="text" name="title" />
                    <label>
                        <img src="{add}" alt="add" />
                        <input type="submit" value="Submit" />
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
        display: grid;
        grid-template-columns: 1fr 3fr;
    }

    li {
        display: flex;
        align-items: center;
    }

    label img {
        cursor: pointer;
        height: 1rem;
    }

    label button,
    label input[type="submit"] {
        display: none;
    }
</style>
