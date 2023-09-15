<script>
    import add from "$lib/icons/add.svg";
    import revert from "$lib/icons/revert.svg";
    import { enhance } from '$app/forms';

    export let formActionURL

    export let isAdding
    export let setIsAdding

    export let setItemIDToEdit
</script>

<li class="helper-text-li">
    <p class="helper-text">Add new:</p>
    <form
        class="add-new-form"
        method="POST"
        action={formActionURL}
        use:enhance
        on:submit={() => setIsAdding(false)}
        on:reset={() => setIsAdding(false)}
    >
        <input
            type="text"
            name="title"
            on:keydown={e => {
                if (e.key === 'Escape') {
                    e.target.value = ''
                    e.target.blur()
                    setIsAdding(false)
                }
            }}
            on:focus={() => {
                setItemIDToEdit(undefined)
                setIsAdding(true)
            }}
        />

        {#if isAdding}
            <label>
                <img src="{add}" alt="add" />
                <input type="submit" value="Submit" />
            </label>

            <label>
                <img src="{revert}" alt="revert" />
                <input type="reset" name="reset" />
            </label>
        {/if}
    </form>
</li>

<style>
    .add-new-form {
        display: grid;
        grid-template-columns: auto 1rem 1rem 1rem;
        align-items: center;
        grid-gap: 1rem;
    }

    .helper-text-li {
        padding-left: .5rem;
    }

    .helper-text {
        font-size: .75rem;
        font-style: italic;
        opacity: .75;
        margin-top: 1rem;
    }

    input {
        padding-left: 7px;
        width: 100%;
        box-sizing: border-box;
    }

    img {
        cursor: pointer;
        height: 1rem;
        opacity: .7;
    }

    img:hover {
        opacity: 1;
    }

    label input {
        display: none;
    }
</style>
