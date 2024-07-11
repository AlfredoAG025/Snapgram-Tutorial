import Loader from '@/components/shared/Loader';
import RootLayout from '../RootLayout'
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import PostCard from '@/components/shared/PostCard';

const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();

  return (
    <RootLayout>
      <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
            <h2 className="w-full text-left h3-bold md:h2-bold">Home Feed</h2>

            {isPostLoading && !posts ? <Loader /> : (
              <ul className="flex flex-col flex-1 w-full gap-9">
                {
                  posts?.documents.map(
                    (post: Models.Document) => (
                      <PostCard key={post.$id} post={post} />
                    )
                  )
                }
              </ul>
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default Home