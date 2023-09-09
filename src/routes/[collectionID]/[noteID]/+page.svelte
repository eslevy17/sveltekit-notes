<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;
</script>

<h4>Content</h4>
<form method="POST" action="?/update-content" use:enhance>
    <textarea name="content">{data.note.content}</textarea>
    <input type="submit" value="Submit" />
</form>
