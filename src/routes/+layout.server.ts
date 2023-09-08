import PocketBase from 'pocketbase';

export async function load() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    const collections = await pb
        .collection('collection')
        .getFullList({
            fields: 'id,title'
        })

    return {
        collections
    };
}
