"use client";
import footer from '@/public/footer.png'
import Logo from './common/Logo'
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { navItems } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavLink from './common/NavLink';
import { useQuery } from '@tanstack/react-query';
import axiosPublic from '@/lib/axios.public';
const Footer = () => {
      const axios = axiosPublic();
      const {
        data, isLoading
      } = useQuery({
        queryKey: ["footer"],
        queryFn:  async () => {
          const res = await axios.get('/general-settings')
          return res.data
        },
        staleTime: 24 * 60 * 60 * 1000,
        cacheTime: Infinity
      })

    const pathname = usePathname();
    const socials = [
        {
            icon: <FaFacebookSquare />,
            link: "#"
        },
        {
            icon: <AiFillInstagram />,
            link: "#"
        },
        {
            icon: <FaSquareXTwitter />,
            link: "#"
        }
    ]

    // main render
    return (
        <footer className='w-full mt-10 sm:mt-20 relative min-h-[500px] pb-6 sm:pb-11 flex flex-col justify-end'>
            <img src={footer.src} className='w-full  inset-0 z-[-1] absolute ' alt="footer" />
            <div className='container flex flex-col justify-start gap-6 sm:gap-14'>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-10'>
                    {/* col-1 */}
                    <div className='w-full flex flex-col gap-3 justify-start items-start'>
                        <Logo className="sm:w-44 sm:h-16 w-32 h-12" />
                        <p>Your one-stop marketplace and digital library. Trade books, read anywhere, and connect with readers worldwide.</p>
                        <div className='flex items-center gap-4'>
                            {
                                socials.map((item, index) => (
                                    <div key={index} className='w-10 h-10 border border-[rgba(19,19,19,0.10)] rounded-full bg-white flex items-center justify-center text-primary text-xl cursor-pointer'>
                                        {item.icon}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    {/* col-2 */}
                    <div className='w-full flex flex-col gap-3 justify-start items-start'>
                        {navItems.map((item, index) => (
                            <NavLink
                                key={index}
                                href={item.link}
                                aria-label={item.name}
                                title={item.name}
                                prefetch={true}
                                end={item.end}
                                activeClassName="text-primary text-lg"
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                    {/* col-3 */}
                    <div className='w-full flex flex-col sm:text-lg gap-3 justify-start items-start'>
                        <Link className="transition-all duration-300 hover:text-primary" href='/terms-and-conditions'>
                            Terms & Conditions
                        </Link>
                        <Link className="transition-all duration-300 hover:text-primary" href='/privacy-policy'>
                            Privacy Policy
                        </Link>
                    </div>
                    {/* col-4 */}
                    <div className='w-full flex flex-col gap-1 sm:gap-3 justify-start items-start'>
                        <h2 className='sm:text-xl text-base font-semibold'>Contact Us</h2>
                        
                        {isLoading ? (
                            <div className="animate-pulse flex flex-col gap-3 w-full mt-2">
                                <div className="h-4 bg-gray-200/20 rounded w-full"></div>
                                <div className="h-4 bg-gray-200/20 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200/20 rounded w-5/6"></div>
                            </div>
                        ) : (
                            <>
                                {/* Address opens Google Maps */}
                                {data?.data?.[0]?.address && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.data[0].address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=" transition-all text-base duration-300 hover:underline"
                                    >
                                        <span>Address:</span> {data.data[0].address}
                                    </a>
                                )}

                                {/* Phone number opens dialer */}
                                {data?.data?.[0]?.phone && (
                                    <a href={`tel:${data.data[0].phone.replace(/[^0-9+]/g, '')}`} className="transition-all duration-300 hover:underline">
                                        <span>Phone:</span> {data.data[0].phone}
                                    </a>
                                )}

                                {/* Email opens mail client */}
                                {data?.data?.[0]?.email && (
                                    <a href={`mailto:${data.data[0].email}`} className="transition-all duration-300 hover:underline">
                                        <span>Email:</span> {data.data[0].email}
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <p className='text-base capitalize'>
                    {isLoading ? (
                        <span className="inline-block animate-pulse h-4 bg-gray-200/20 rounded w-64"></span>
                    ) : (
                        data?.data?.[0]?.copyright || `©${new Date().getFullYear()} BookNest. All rights reserved`
                    )}
                </p>
            </div>
        </footer>
    )
}

export default Footer