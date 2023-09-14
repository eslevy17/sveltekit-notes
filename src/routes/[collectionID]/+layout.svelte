<script>
    import { enhance } from '$app/forms';
    import edit from '$lib/icons/edit.svg';
    import file from '$lib/icons/file.svg';
    import revert from '$lib/icons/revert.svg';
    import trash from '$lib/icons/trash.svg';
    import save from '$lib/icons/save.svg';
    import {afterUpdate} from "svelte";
    import { page } from "$app/stores";
    import AddNewItemForm from "$lib/components/AddNewItemForm.svelte";

    export let data;

    afterUpdate(() => {
        if (noteIDToEdit) {
            document.querySelector('form[name="note-edit-form"] input[type="text"]').focus()
        }
    })

    let noteIDToEdit;
    let isAdding = false;

    let urlParams;

    $: {
        urlParams = {
            collectionID: $page.url.pathname.split('/')[1],
            noteID: $page.url.pathname.split('/')[2]
        }
    }
</script>

<div class="collection-list">
    <div class="notes-list">
        {#if !data.collection.expand?.notes.length}
            <p class="helper-text">No notes yet</p>
        {/if}

        <ul>
            {#if data.collection.expand?.notes}
                {#each data.collection.expand?.notes as note (note)}
                    <li class="note-details" class:isSelected={note.id === urlParams.noteID}>
                        <img src="{file}" alt="file" />
                        {#if note.id !== noteIDToEdit}
                            <div class="note-interior">
                                <a href="/{data.collection.id}/{note.id}">
                                    {note.title}
                                </a>
                                <label>
                                    <img src="{edit}" alt="edit" />
                                    <button
                                        on:click={() => {
                                            noteIDToEdit = note.id
                                            isAdding = false
                                        }}
                                    >Edit</button>
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

            <AddNewItemForm
                formActionURL="/{data.collection.id}/noteID?/create"
                {isAdding}
                setIsAdding={newVal => isAdding = newVal}
                setItemIDToEdit={newVal => noteIDToEdit = newVal}
            />
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
        grid-template-columns: 1rem auto 1rem;
        align-items: center;
        padding-left: .5rem;
    }

    .note-details:hover {
        background-color: var(--bg-hover-color);
    }

    .note-details.isSelected {
        background-color: var(--bg-hover-color);
    }

    .note-interior {
        width: 100%;
        display: grid;
        grid-template-columns: auto 1rem 1rem;
        align-items: center;
    }

    .note-edit-form {
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
