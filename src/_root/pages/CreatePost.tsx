import PostForm from '@/components/forms/PostForm'
import RootLayout from '../RootLayout'

const CreatePost = () => {
  return (
    <RootLayout>
      <div className='flex flex-1'>
        <div className="common-container">
          <div className='justify-start w-full max-w-5xl gap-3 flex-start'>
            <img src="/assets/icons/add-post.svg" alt="add post" width={36} height={36} />
            <h2 className='w-full text-left h3-bold md:h2-bold'>Create Post</h2>
          </div>

          <PostForm />
        </div>
      </div>
    </RootLayout>
  )
}

export default CreatePost