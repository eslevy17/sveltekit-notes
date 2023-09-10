<script lang="ts">
    import { enhance } from '$app/forms';
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
                            <button on:click={() => {noteIDToEdit = note.id}}>Edit</button>
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
                                <input type="Submit" value="Delete" />
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
                                <input type="submit" value="Submit" />
                                <button on:click={() => noteIDToEdit = undefined}>Cancel</button>
                            </form>
                        {/if}
                    </li>
                {/each}
            {/if}

            <li>
                <form method="POST" action="/{data.collection.id}/noteID?/create" use:enhance>
                    <input type="text" name="title" />
                    <input type="submit" value="Submit" />
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
</style>
