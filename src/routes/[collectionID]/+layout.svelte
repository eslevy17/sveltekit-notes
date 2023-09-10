<script lang="ts">
    import { enhance } from '$app/forms';
    import add from '$lib/icons/add.svg';
    import edit from '$lib/icons/edit.svg';
    import revert from '$lib/icons/revert.svg';
    import trash from '$lib/icons/trash.svg';
    import save from '$lib/icons/save.svg';

    export let data;

    let noteIDToEdit;
</script>

<div class="collection-list">
    <div>
        <h2>{data.collection.title}</h2>

        <ul>
            {#if data.collection.expand?.notes}
                {#each data.collection.expand?.notes as note (note)}
                    <li>
                        {#if note.id !== noteIDToEdit}
                            <a href="/{data.collection.id}/{note.id}">
                                {note.title}
                            </a>
                            <label>
                                <img src="{edit}" alt="edit" />
                                <button on:click={() => noteIDToEdit = note.id}>Edit</button>
                            </label>
                            <form
                                method="POST"
                                action="/{data.collection.id}/{note.id}?/delete"
                                use:enhance={({ cancel }) => {
                                    if (!confirm(
                                        'Are you sure you wish to delete this note?'
                                        + `\n\n"${note.title}"`
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
                                action="/{note.collection}/{note.id}?/update-title"
                                use:enhance={() => {
                                    return async ({ update }) => {
                                        await update()
                                        noteIDToEdit = undefined
                                    }
                                }}
                            >
                                <input type="text" name="title" value="{note.title}" />

                                <label>
                                    <img src="{save}" alt="save" />
                                    <input type="submit" value="Submit" />
                                </label>

                                <label>
                                    <img src="{revert}" alt="revert" />
                                    <button on:click={() => noteIDToEdit = undefined}>Cancel</button>
                                </label>
                            </form>
                        {/if}
                    </li>
                {/each}
            {/if}

            <li>
                <form method="POST" action="/{data.collection.id}/noteID?/create" use:enhance>
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
    .collection-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
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
