import { ID, ImageGravity, Query } from 'appwrite';

import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appWriteConfig, avatars, databases, storage } from './config';

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: avatarUrl,
            username: user.username,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.usersCollectionId,
            ID.unique(),
            user,
        );

        return newUser;
    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user: { email: string, password: string }) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function createNewPost(post: INewPost) {
    try {
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        };

        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        const newPost = await databases.createDocument(appWriteConfig.databaseId, appWriteConfig.postsColecctionId, ID.unique(), {
            creator: post.userId,
            likes: null,
            caption: post.caption,
            tags: tags,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            save: null,
        });

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(appWriteConfig.storageId, ID.unique(), file);

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(appWriteConfig.storageId, fileId, 2000, 2000, ImageGravity.Top, 100);

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appWriteConfig.storageId, fileId);

        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(appWriteConfig.databaseId, appWriteConfig.postsColecctionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]);

    if (!posts) throw Error;

    return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(appWriteConfig.databaseId, appWriteConfig.postsColecctionId, postId, {
            likes: likesArray,
        });

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const savePost = await databases.createDocument(appWriteConfig.databaseId, appWriteConfig.savesColecctionId, ID.unique(), {
            user: userId,
            post: postId,
        });

        if (!savePost) throw Error;

        return savePost;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavePost(saveRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(appWriteConfig.databaseId, appWriteConfig.savesColecctionId, saveRecordId);

        if (!statusCode) throw Error;

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appWriteConfig.databaseId,
            appWriteConfig.postsColecctionId,
            postId
        );

        return post;
    } catch (error) {
        console.log(error);
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
    try {

        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        };

        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(post.file[0]);

            if (!uploadedFile) throw Error;

            const fileUrl = getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
        }

        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        const updatedPost = await databases.updateDocument(appWriteConfig.databaseId, appWriteConfig.postsColecctionId, post.postId, {
            caption: post.caption,
            tags: tags,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            location: post.location,
        });

        if (!updatedPost) {
            await deleteFile(post.imageId);
            throw Error;
        }

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) throw Error;

    try {
        await databases.deleteDocument(
            appWriteConfig.databaseId,
            appWriteConfig.postsColecctionId,
            postId
        );

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.postsColecctionId,
            queries
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.postsColecctionId,
            [Query.search('caption', searchTerm)]
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}