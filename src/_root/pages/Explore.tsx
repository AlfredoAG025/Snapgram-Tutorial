import { Input } from '@/components/ui/input'
import RootLayout from '../RootLayout'
import { useEffect, useState } from 'react'
import SearchResults from '@/components/shared/SearchResults';
import GridPostList from '@/components/shared/GridPostList';
import { useGetPost, useSearchPosts } from '@/lib/react-query/queriesAndMutations';
import useDebounce from '@/hooks/useDebounce';
import Loader from '@/components/shared/Loader';
import { useInView } from 'react-intersection-observer';

const Explore = () => {
  const { ref, inView } = useInView();

  const { data: posts, fetchNextPage, hasNextPage } = useGetPost();

  const [searchValue, setSearchValue] = useState('');

  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts) return <RootLayout><div className='w-full h-full flex-center'><Loader /></div></RootLayout>

  const shouldShowSearchResults = searchValue != '';
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item?.documents.length === 0);

  return (
    <RootLayout>
      <div className='explore-container'>
        <div className='explore-inner_container'>
          <h2 className='w-full h3-bold md:h2-bold'>Search Posts</h2>
          <div className='flex w-full gap-1 px-4 rounded-lg bg-dark-4'>
            <img src="/assets/icons/search.svg" alt="serach" width={24} height={24} />

            <Input type='text' placeholder='search' className='explore-search'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <div className='w-full max-w-5xl mt-16 flex-between mb-7'>
          <h3 className='body-bold md:h3-bold'>Popular Today</h3>

          <div className="gap-3 px-4 py-2 cursor-pointer flex-center bg-dark-3 rounded-xl">
            <p className="small-medium md:base-medium text-light-2">All</p>
            <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
          </div>
        </div>

        <div className='flex flex-wrap w-full max-w-5xl gap-9'>
          {shouldShowSearchResults ? (
            <SearchResults isSearchFetching={isSearchFetching}
              searchedPosts={searchedPosts}
            />
          ) : shouldShowPosts ? (<p className='w-full mt-10 text-center text-light-4'>End of posts</p>) : posts.pages.map((item, index) => <GridPostList key={`page-${index}`} posts={item.documents} />)}
        </div>

        {
          hasNextPage && !searchValue && (
            <div ref={ref} className='mt-10'>
              <Loader />
            </div>
          )
        }

      </div>
    </RootLayout>
  )
}

export default Explore