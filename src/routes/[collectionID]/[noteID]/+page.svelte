<script>
    import { enhance } from '$app/forms';
    import revert from '$lib/icons/revert.svg';
    import save from '$lib/icons/save.svg';
    import {invalidateAll} from "$app/navigation";

    export let data;
</script>

<div class="note-details">
    <h3>{data.note.title}</h3>
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
</div>

<style>
    .note-details {
        padding: 0 1.25rem;
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

    form {
        display: grid;
        grid-template-columns: auto 1.75rem 1.75rem;
        align-items: end;
    }

    textarea {
        resize: vertical;
    }
</style>
