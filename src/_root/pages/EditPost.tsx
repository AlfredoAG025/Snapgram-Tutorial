import PostForm from '@/components/forms/PostForm'
import RootLayout from '../RootLayout'
import { useParams } from 'wouter'
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';
import Loader from '@/components/shared/Loader';

const EditPost = () => {

  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');

  if (isPending) return <RootLayout><Loader /></RootLayout>

  return (
    <RootLayout>
      <div className='flex flex-1'>
        <div className="common-container">
          <div className='justify-start w-full max-w-5xl gap-3 flex-start'>
            <img src="/assets/icons/add-post.svg" alt="add post" width={36} height={36} />
            <h2 className='w-full text-left h3-bold md:h2-bold'>Edit Post</h2>
          </div>

          <PostForm action="Update" post={post}/>
        </div>
      </div>
    </RootLayout>
  )
}

export default EditPost