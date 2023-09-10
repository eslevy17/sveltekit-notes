import PocketBase from 'pocketbase';
import { redirect } from "@sveltejs/kit";

export const actions = {
    create: async ({ request }) => {
        const pb = new PocketBase('http://127.0.0.1:8090');

        const data = await request.formData();

        await pb.collection('collection').create(data);
    },
    update: async ({ request, params }) => {
        const pb = new PocketBase('http://127.0.0.1:8090');

        const data = await request.formData();

        await pb
            .collection('collection')
            .update(
                params.collectionID,
                {
                    title: data.get('title')
                }
            )
    },
    delete: async ({ params }) => {
        const pb = new PocketBase('http://127.0.0.1:8090');

        // because it doesn't cascade, unless you do some extra things,
        // we have to delete these manually:
        const notes = await pb
            .collection('note')
            .getFullList(
                {
                    filter: `collection="${params.collectionID}"`
                }
            )

        // because there's no batch delete until some later version,
        // we have to go one by one:
        for (const note of notes) {
            await pb
                .collection('note')
                .delete(note.id);
        }

        await pb
            .collection('collection')
            .delete(params.collectionID);

        throw redirect(303, '/')
    }
}
