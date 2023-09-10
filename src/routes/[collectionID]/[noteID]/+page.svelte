<script lang="ts">
    import { enhance } from '$app/forms';
    import save from '$lib/icons/save.svg';

    export let data;
</script>

<h4>Content</h4>
<form method="POST" action="?/update-content" use:enhance>
    <textarea name="content">{data.note.content}</textarea>
    <label>
        <img src="{save}" alt="save" />
        <input type="submit" value="Submit" />
    </label>
</form>

<style>
    label img {
        cursor: pointer;
        height: 1rem;
    }

    label input[type="submit"] {
        display: none;
    }
</style>
