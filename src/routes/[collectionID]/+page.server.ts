import PocketBase from 'pocketbase';

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
    }
}
