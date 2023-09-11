<script lang="ts">
    import { enhance } from '$app/forms';
    import revert from '$lib/icons/revert.svg';
    import save from '$lib/icons/save.svg';
    import {invalidateAll} from "$app/navigation";

    export let data;
</script>

<h4>{data.note.title}</h4>
<form method="POST" action="?/update-content" use:enhance>
    <textarea name="content" bind:value={data.note.content}></textarea>
    <label>
        <img src="{save}" alt="save" />
        <input type="submit" value="Submit" />
    </label>

    <label>
        <img src="{revert}" alt="revert" />
        <button on:click|preventDefault={() => invalidateAll()}>Revert</button>
    </label>
</form>

<style>
    label img {
        cursor: pointer;
        height: 1rem;
    }

    label button,
    label input[type="submit"] {
        display: none;
    }
</style>
