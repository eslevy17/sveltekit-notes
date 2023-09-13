<script>
    import { enhance } from '$app/forms';
    import add from '$lib/icons/add.svg';
    import edit from '$lib/icons/edit.svg';
    import revert from '$lib/icons/revert.svg';
    import trash from '$lib/icons/trash.svg';
    import save from '$lib/icons/save.svg';
    import {afterUpdate} from "svelte";

    export let data;

    afterUpdate(() => {
        if (noteIDToEdit) {
            document.querySelector('form[name="note-edit-form"] input[type="text"]').focus()
        }
    })

    let noteIDToEdit;
</script>

<div class="collection-list">
    <div class="notes-list">
        <h3>{data.collection.title}</h3>

        <ul>
            {#if data.collection.expand?.notes}
                {#each data.collection.expand?.notes as note (note)}
                    <li class="note-details">
                        {#if note.id !== noteIDToEdit}
                            <div class="note-interior">
                                <a href="/{data.collection.id}/{note.id}">
                                    {note.title}
                                </a>
                                <label>
                                    <img src="{edit}" alt="edit" />
                                    <button on:click={() => noteIDToEdit = note.id}>Edit</button>
                                </label>
                            </div>
                        {:else}
                            <form
                                name="note-edit-form"
                                class="note-edit-form"
                                method="POST"
                                action="/{note.collection}/{note.id}?/update-title"
                                use:enhance={() => {
                                    return async ({ update }) => {
                                        await update()
                                        noteIDToEdit = undefined
                                    }
                                }}
                            >
                                <input
                                    type="text"
                                    name="title"
                                    value="{note.title}"
                                    on:keydown={e => {
                                        if (e.key === 'Escape') {
                                            noteIDToEdit = undefined
                                        }
                                    }}
                                />

                                <label>
                                    <img src="{save}" alt="save" />
                                    <input type="submit" value="Submit" />
                                </label>

                                <label>
                                    <img src="{revert}" alt="revert" />
                                    <button on:click={() => noteIDToEdit = undefined}>Cancel</button>
                                </label>
                            </form>
                            <form
                                class="note-edit-form"
                                method="POST"
                                action="/{data.collection.id}/{note.id}?/delete"
                                use:enhance={({ cancel }) => {
                                    if (!confirm(
                                        'Are you sure you wish to delete this note?'
                                        + `\n\n"${note.title}"`
                                    )) cancel()

                                    return async ({ update }) => {
                                        await update()
                                        noteIDToEdit = undefined
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
            {/if}

            <li>
                <p class="add-new"><i>Add new:</i></p>
                <form
                    class="add-new-form"
                    method="POST"
                    action="/{data.collection.id}/noteID?/create"
                    use:enhance
                >
                    <input
                        type="text"
                        name="title"
                        on:keydown={e => {
                            if (e.key === 'Escape') {
                                e.target.value = ''
                                e.target.blur()
                            }
                        }}
                        on:focus={() => noteIDToEdit = undefined}
                    />

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
    .collection-list {
        display: grid;
        grid-template-columns: 1fr 2fr;
        height: 100%;
    }

    .notes-list {
        padding: 0 1.25rem;
        border-right: 1px solid var(--border-color);
    }

    .note-details {
        display: grid;
        grid-template-columns: auto 1rem;
        align-items: center;
    }

    .note-interior {
        width: 100%;
        display: grid;
        grid-template-columns: auto 1rem 1rem;
    }

    .note-edit-form {
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
