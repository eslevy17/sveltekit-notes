import PocketBase from 'pocketbase';

export async function load({ params }) {
    const pb = new PocketBase('http://127.0.0.1:8090');

    const note = await pb
        .collection('note')
        .getOne(
            params.noteID,
            {
                fields: 'content'
            }
        )

    return {
        note
    };
}

export const actions = {
    create: async ({ request, params }) => {
        const pb = new PocketBase('http://127.0.0.1:8090');

        const data = await request.formData();

        const note = await pb.collection('note').create({
            title: data.get('title'),
            collection: params.collectionID
        });

        // hate this. why doesn't adding a record (with a relation)
        // update the other side of the relation? there must be a way.
        // doing it manually in the meantime.
        await pb
            .collection('collection')
            .update(
                params.collectionID,
                {
                    'notes+': note.id,
                }
            )
    },
    "update-title": async ({ request, params}) => {
        const pb = new PocketBase('http://127.0.0.1:8090');

        const data = await request.formData();

        await pb
            .collection('note')
            .update(
                params.noteID,
                {
                    title: data.get('title')
                }
            )
    },
    "update-content": async ({ request, params }) => {
        const pb = new PocketBase('http://127.0.0.1:8090');

        const data = await request.formData();

        await pb
            .collection('note')
            .update(
                params.noteID,
                {
                    content: data.get('content'),
                }
            )
    }
}
