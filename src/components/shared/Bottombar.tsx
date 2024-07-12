import { bottombarLinks } from '@/constants';
import { Link, useLocation } from 'wouter';

const Bottombar = () => {
  const [location] = useLocation();

  return (
    <section className="bottom-bar">
      {
        bottombarLinks.map((link) => {
          const isActive = location === link.route;

          return (
            <Link to={link.route}
              key={link.label}
              className={`${isActive && 'bg-primary-500 rounded-[10px]'} group flex-center flex-col gap-1 p-2 transition`}
            >
              <img src={link.imgURL} alt={link.label}
                className={`${isActive && 'invert-white'}`}
                width={16}
                height={16}
              />
              <p className="tiny-medium text-light-2">{link.label}</p>
            </Link>
          )
        })
      }
    </section>
  )
}

export default Bottombar