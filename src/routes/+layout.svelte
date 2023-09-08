<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;
</script>

<div class="grid-layout">
    <div>
        <h1>Notes</h1>
        <ul>
            {#each data.collections as collection (collection)}
                <li>
                    <a href="/{collection.id}">
                        {collection.title}
                    </a>
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
