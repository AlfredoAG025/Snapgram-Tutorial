import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import RootLayout from "../RootLayout"
import { Link, useParams } from "wouter";
import Loader from "@/components/shared/Loader";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";

const handleDeletePost = () => {

}

const PostDetails = () => {

  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');

  const { user } = useUserContext();

  return (
    <RootLayout>
      <div className="post_details-container">
        {isPending ? <Loader /> :
          <div className="post_details-card">

            <img src={post?.imageUrl} alt="post" className="post_details-img" />

            <div className="post_details-info">
              <div className="w-full flex-between">
                <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                  <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator"
                    className="w-8 h-8 rounded-full lg:w-12 lg:h-12"
                  />


                  <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                      {post?.creator.name}
                    </p>
                    <div className="gap-2 flex-center text-light-3">
                      <p className="subtle-semibold lg:small-regular">
                        {multiFormatDateString(post?.$createdAt)}
                      </p>
                      -
                      <p className="subtle-semibold lg:small-regular">
                        {post?.location}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="flex-center">
                  <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && 'hidden'}`}>
                    <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                  </Link>

                  <Button onClick={handleDeletePost} variant="ghost"
                    className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}
                  >
                    <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                  </Button>
                </div>
              </div>

              <hr className="w-full border border-dark-4/80" />

              <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                <p>{post?.caption}</p>
                <ul className="flex gap-1 mt-2">
                  {post?.tags.map((tag: string) => (<li key={tag} className="text-light-3">
                    #{tag}
                  </li>))}
                </ul>
              </div>

              <div className="w-full">
                <PostStats post={post} userId={user.id} />
              </div>

            </div>
          </div>}
      </div>
    </RootLayout>
  )
}

export default PostDetails