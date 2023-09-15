<script>
    import folder from "$lib/icons/folder.svg";
    import file from "$lib/icons/file.svg";
    import edit from "$lib/icons/edit.svg";
    import save from "$lib/icons/save.svg";
    import revert from "$lib/icons/revert.svg";
    import trash from "$lib/icons/trash.svg";
    import { enhance } from '$app/forms';
    import { onMount } from "svelte";

    export let itemType; // 'collection' | 'note'
    export let itemID;
    export let itemTitle;

    export let parentCollectionID; // nullable

    export let isSelected;
    export let isEditing;

    export let setItemIDToEdit;
    export let setIsAdding;

    let iconType;
    let iconName;
    let linkTarget;
    let editFormActionURL;
    let deleteFormActionURL;

    onMount(() => {
        if (itemType === 'collection') {
            iconType = folder;
            iconName = 'folder'
            linkTarget = `/${itemID}`
            editFormActionURL = `/${itemID}?/update`
            deleteFormActionURL = `/${itemID}?/delete`
        }
        else if (itemType === 'note') {
            iconType = file;
            iconName = 'file'
            linkTarget = `/${parentCollectionID}/${itemID}`
            editFormActionURL = `/${parentCollectionID}/${itemID}?/update-title`
            deleteFormActionURL = `/${parentCollectionID}/${itemID}?/delete`
        }
    })
</script>

<li class="item-details" class:isSelected>
    <img src="{iconType}" alt={iconName} class="item-label-img" />
    {#if !isEditing}
        <div class="item-interior">
            <a href={linkTarget}>
                {itemTitle}
            </a>
            <label>
                <img src="{edit}" alt="edit" />
                <button
                    on:click={() => {
                        setItemIDToEdit(itemID)
                        setIsAdding(false)
                    }}
                >
                    Edit
                </button>
            </label>
        </div>
    {:else}
        <form
            name={`${itemType}-edit-form`}
            class="item-edit-form"
            method="POST"
            action={editFormActionURL}
            use:enhance={() => {
                return async ({ update }) => {
                    await update()
                    setItemIDToEdit(undefined)
                }
            }}
        >
            <input
                type="text"
                name="title"
                value={itemTitle}
                on:keydown={e => {
                    if (e.key === 'Escape') {
                        setItemIDToEdit(undefined)
                    }
                }}
            />

            <label>
                <img src="{save}" alt="save" />
                <input type="submit" value="Submit" />
            </label>

            <label>
                <img src="{revert}" alt="revert" />
                <button on:click={() => setItemIDToEdit(undefined)}>Revert</button>
            </label>
        </form>
        <form
            method="POST"
            action={deleteFormActionURL}
            use:enhance={({ cancel }) => {
                if (!confirm(
                    `Are you sure you wish to delete this ${itemType}?`
                    + `\n\n"${itemTitle}"`
                )) cancel()

                return async ({ update }) => {
                    await update()
                    setItemIDToEdit(undefined)
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

<style>
    .item-details {
        display: grid;
        grid-template-columns: 1rem auto 1rem;
        align-items: center;
        padding-left: .5rem;
    }

    .item-details:hover {
        background-color: var(--bg-hover-color);
    }

    .item-details.isSelected {
        background-color: var(--bg-hover-color);
    }

    .item-interior {
        width: 100%;
        display: grid;
        grid-template-columns: auto 1rem 1rem;
        align-items: center;
    }

    .item-edit-form {
        display: grid;
        grid-template-columns: auto 1rem 1rem;
        grid-gap: 1rem;
        align-items: center;
        margin-right: 1rem;
    }

    input {
        /* so the view/edit toggle doesn't move the content */
        margin: -1px 0 -1px 3px;
        padding-left: 4px;
        width: 100%;
        box-sizing: border-box;
    }

    img {
        cursor: pointer;
        height: 1rem;
        opacity: .7;
    }

    img:hover:not(.item-label-img) {
        opacity: 1;
    }

    label button,
    label input {
        display: none;
    }
</style>