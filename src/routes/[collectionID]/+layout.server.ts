import PocketBase from 'pocketbase';

export async function load({ url, params }) {
    const pb = new PocketBase('http://127.0.0.1:8090');

    const collection = await pb
        .collection('collection')
        .getOne(
            params.collectionID,
            {
                fields: 'id,title,expand.notes.id,expand.notes.title',
                expand: 'notes'
            }
        )

    const { pathname } = url

    return {
        collection,
        pathname
    };
}
