<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;
</script>

<div class="collection-list">
    <div>
        <h2>{data.collection.title}</h2>

        <ul>
            {#if data.collection.expand?.notes}
                {#each data.collection.expand?.notes as note (note)}
                    <li>
                        <a href="/{data.collection.id}/{note.id}">
                            {note.title}
                        </a>
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
</style>
