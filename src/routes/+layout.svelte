<script lang="ts">
    import { enhance } from '$app/forms';
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
                        <button on:click={() => {collectionIDToEdit = collection.id}}>Edit</button>
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
                            <input type="submit" value="Submit" />
                            <button on:click={() => {collectionIDToEdit = undefined}}>Cancel</button>
                        </form>
                    {/if}
                </li>
            {/each}

            <li>
                <form method="POST" action="/collectionID?/create" use:enhance>
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
    .grid-layout {
        display: grid;
        grid-template-columns: 1fr 3fr;
    }
</style>
