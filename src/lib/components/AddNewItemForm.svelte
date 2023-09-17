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

        <label class:isAdding>
            <img src="{add}" alt="add" />
            <input type="submit" value="Submit" />
        </label>

        <label class:isAdding>
            <img src="{revert}" alt="revert" />
            <input type="reset" name="reset" />
        </label>
    </form>
</li>

<style>
    .add-new-form {
        display: grid;
        grid-template-columns: auto 1rem 1rem;
        align-items: center;
        grid-gap: .5rem;
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
        padding: 4px 7px;
        width: 100%;
        box-sizing: border-box;
    }

    label {
        cursor: pointer;
        opacity: .7;
    }

    label input {
        display: none;
    }

    label:hover {
        background-color: var(--bg-hover-color);
    }

    label:not(.isAdding) {
        opacity: .2;
        cursor: default;
        pointer-events: none;
    }
</style>
