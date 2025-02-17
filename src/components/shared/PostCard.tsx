import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString, } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "wouter";
import PostStats from "./PostStats";

type PostCardProps = {
    post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext();

    if (!post.creator) return;

    return (
        <div className="post-card">
            <div className="flex-between">
                <div className="flex gap-3 item-center">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator"
                            className="w-12 rounded-full lg:h-12"
                        />
                    </Link>

                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                            {post.creator.name}
                        </p>
                        <div className="gap-2 flex-center text-light-3">
                            <p className="subtle-semibold lg:small-regular">
                                {multiFormatDateString(post.$createdAt)}
                            </p>
                            -
                            <p className="subtle-semibold lg:small-regular">
                                {post.location}
                            </p>
                        </div>
                    </div>
                </div>
                <Link to={`/update-post/${post.$id}`}
                    className={`${user.id !== post.creator.$id && 'hidden'} `}
                >
                    <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                </Link>
            </div>

            <Link to={`/posts/${post.$id}`}>
                <div className="py-5 small-medium lg:base-medium">
                    <p>{post.caption}</p>
                    <ul className="flex gap-1 mt-2">
                        {post.tags.map((tag: string) => (<li key={tag} className="text-light-3">
                            #{tag}
                        </li>))}
                    </ul>
                </div>

                <img src={post.imageUrl || '/assests/icons/profie-placeholder.svg'} alt="post image" className="post-card_img" />
            </Link>

            <PostStats post={post} userId={user.id} />
        </div>
    )
}

export default PostCard