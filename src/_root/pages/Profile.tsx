import { useUserContext } from '@/context/AuthContext'
import RootLayout from '../RootLayout'

const Profile = () => {

  const { user } = useUserContext();

  return (
    <RootLayout>
      <div className="profile-container">
        <div className="profile-inner_container">
          <img src={`${user.imageUrl ? user.imageUrl : '/assets/icons/profile-placeholder.svg'}`} alt="profile" className='w-48 h-48 rounded-full' />

          <div className="flex flex-col gap-4 mt-2">
            <p className="text-4xl">{user.name}</p>
            <p className="body-medium text-light-3">@{user.name}</p>

            <div className="flex gap-4">
              <div>
                <p className='text-primary-500 body-medium'>0</p>
                <p className='body-medium'>Posts</p>
              </div>

              <div>
                <p className='text-primary-500 body-medium'>0</p>
                <p className='body-medium'>Followers</p>
              </div>

              <div>
                <p className='text-primary-500 body-medium'>0</p>
                <p className='body-medium'>Following</p>
              </div>
            </div>

            <div>
              {user.bio}
            </div>

          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default Profile