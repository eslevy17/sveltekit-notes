<script>
    import {afterUpdate} from "svelte";
    import AddNewItemForm from "$lib/components/AddNewItemForm.svelte";
    import ItemLine from "$lib/components/ItemLine.svelte";
    import ItemSearch from "$lib/components/ItemSearch.svelte";
    import { fade } from 'svelte/transition';

    export let data;

    afterUpdate(() => {
        if (noteIDToEdit
            && document.querySelector('input[name="note-search-field"]') !== document.activeElement
        ) {
            document.querySelector('form[name="note-edit-form"] input[type="text"]').focus()
        }
    })

    let noteIDToEdit;
    let isAdding = false;
    let searchTerms;

    let urlParams;

    $: urlParams = {
        collectionID: data.pathname.split('/')[1],
        noteID: data.pathname.split('/')[2]
    }
</script>

<div class="collection-list">
    <div class="notes-list">
        {#if !data.collection.expand?.notes.length}
            <p class="helper-text">No notes yet</p>
        {:else}
            <ItemSearch
                itemType="note"
                {searchTerms}
                setSearchTerms={e => {
                    // e can be undefined if the form is reset()
                    searchTerms = e?.target?.value
                }}
                setIsAdding={newVal => isAdding = newVal}
            />
        {/if}

        <ul>
            {#if data.collection.expand?.notes}
                {#each data.collection.expand?.notes.filter(note => !searchTerms || note.title.toLowerCase().includes(searchTerms?.toLowerCase())) as note (note.id)}
                    <ItemLine
                        itemType="note"
                        itemID={note.id}
                        itemTitle={note.title}

                        parentCollectionID={data.collection.id}

                        isSelected={note.id === urlParams.noteID}
                        isEditing={note.id === noteIDToEdit}

                        setItemIDToEdit={newVal => noteIDToEdit = newVal}
                        setIsAdding={newVal => isAdding = newVal}
                    />
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

    <div class="note-details-slot">
        {#key urlParams.noteID}
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
    .collection-list {
        transition: background-color var(--animation-speed);
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-areas:
            "note-collection note-details";
        height: 100%;
    }

    .notes-list {
        grid-area: note-collection;
        padding: 0 1.25rem;
        border-right: 1px solid var(--border-color);
        transition:
            border var(--animation-speed),
            background-color var(--animation-speed)
        ;
        background-color: var(--bg-color-x-dark);
    }

    .note-details-slot {
        grid-area: note-details;
    }

    .helper-text {
        font-size: .75rem;
        font-style: italic;
        opacity: .75;
        margin-top: 1rem;
    }
</style>
