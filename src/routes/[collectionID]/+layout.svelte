<script>
    import {afterUpdate} from "svelte";
    import { page } from "$app/stores";
    import AddNewItemForm from "$lib/components/AddNewItemForm.svelte";
    import ItemLine from "$lib/components/ItemLine.svelte";
    import ItemSearch from "$lib/components/ItemSearch.svelte";

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
                {#each data.collection.expand?.notes.filter(note => !searchTerms || note.title.toLowerCase().includes(searchTerms?.toLowerCase())) as note (note)}
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

    .helper-text {
        font-size: .75rem;
        font-style: italic;
        opacity: .75;
        margin-top: 1rem;
    }
</style>
