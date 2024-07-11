import { ID, ImageGravity, Query } from 'appwrite';

import { INewPost, INewUser } from "@/types";
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
