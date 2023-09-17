<script>
    import { enhance } from '$app/forms';
    import revert from '$lib/icons/revert.svg';
    import save from '$lib/icons/save.svg';
    import {invalidateAll} from "$app/navigation";

    export let data;
</script>

<div class="note-details">
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
        transition: background-color var(--animation-speed);
        height: 100%;
        box-sizing: border-box;
        padding: 1.25rem 0 0 1.25rem;
    }

    label {
        cursor: pointer;
        opacity: .7;
    }

    label:hover {
        opacity: 1;
        background-color: var(--bg-hover-color);
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
        padding: .5rem;
        resize: vertical;
    }
</style>
