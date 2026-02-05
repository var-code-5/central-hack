import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


export default function page() {
  return (
    <div className='min-h-screen w-screen bg-black text-c-home-blue overflow-hidden -z-10'>
      {/* Yantra */}
      <div className='relative h-screen w-screen bg-[#091320] flex items-center justify-center plus-background-container overflow-hidden'>
        <div className='rounded-full w-3/4 aspect-square bg-[#091320] overflow-hidden flex items-center justify-center'>
          <Image src="/home/y.png" alt="Yantra Image" height={1000} width={1000} className='w-3/4 h-auto' />
        </div>
        <div className='absolute text-white bottom-1/5 flex flex-col sm:flex-row items-center gap-4'>
          <Link href="/problem-statements">
            <button className="bg-c-blue/20 text-white px-4 py-2 border-b-2 border-c-blue hover:bg-c-red transition-all duration-150 cursor-pointer w-full sm:w-auto min-w-44">
              Problem Statements
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="bg-c-blue/20 text-white px-4 py-2 border-b-2 border-c-blue hover:bg-c-red transition-all duration-150 cursor-pointer w-full sm:w-auto min-w-44">
              Register
            </button>
          </Link>
        </div>
        <div className='hidden lg:block'>
          <div className='absolute left-0 top-1/4 text-white font-jetbrains-mono flex flex-col gap-2 items-center'>
            <h1>1) Why Join Yantra</h1>
            <div className='group flex flex-col items-center gap-2'>
              <div className='aspect-square w-4 h-4 shadow-c-red bg-c-red cursor-pointer'></div>
              <p className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-c-blue/20 px-4 py-2 border-b'>Learn, Compete and Broaden your horizons</p>
            </div>
          </div>
          <div className='absolute right-0 top-1/4 text-white font-jetbrains-mono flex flex-col gap-2 items-center'>
            <h1>2) What is Yantra</h1>
            <div className='group flex flex-col items-center gap-2'>
              <div className='aspect-square w-4 h-4 shadow-c-red bg-c-red cursor-pointer'></div>
              <p className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-c-blue/20 px-4 py-2 border-b'>A week long tech-fest of VIT Vellore</p>
            </div>
          </div>
          <div className='absolute left-0 bottom-1/4 text-white font-jetbrains-mono flex flex-col gap-2 items-center'>
            <h1>3) Who should join?</h1>
            <div className='group flex flex-col items-center gap-2'>
              <div className='aspect-square w-4 h-4 shadow-c-red bg-c-red cursor-pointer'></div>
              <p className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-c-blue/20 px-4 py-2 border-b'>Irrespective of the year, the events cater to all needs</p>
            </div>
          </div>
          <div className='absolute right-[10%] bottom-1/4 text-white font-jetbrains-mono flex flex-col gap-2 items-center'>
            <h1>4) Stats</h1>
            <div className='group flex flex-col items-center gap-2'>
              <div className='aspect-square w-4 h-4 shadow-c-red bg-c-red cursor-pointer'></div>
              <p className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-c-blue/20 px-4 py-2 border-b'>70+ events<br /> 10K+ Participants<br /> 10L+ prize money</p>
            </div>
          </div>
        </div>
        
      </div>

      {/* hero */}
      {/* <div className="h-screen w-screen bg-c-blue/20 px-10 z-10">
        <Image src="/home/vit.png" alt="Hero Image" height={1000} width={1000} className='w-1/3 h-auto' />
        <div className='flex flex-col gap-4 items-end text-xl text-c-home-blue font-jetbrains-mono'>
          <p className='bg-c-blue/30 p-4'>Vellore Institute of Technology (VIT) Vellore is a premier private deemed university </p>
          <p className='bg-c-blue/30 p-4'> in Tamil Nadu, India, founded in 1984 by G. Viswanathan.  </p>
          <p className='bg-c-blue/30 p-4'>Known for its top-tier engineering education,</p>
          <p className='bg-c-blue/30 p-4'>it consistently ranks among India's best</p>
        </div>
        <h1 className='uppercase'>About: vit vellore</h1>
        <Link href="https://vit.ac.in/" target='_blank' className=''>Learn more</Link>
      </div> */}

    </div>
  )
}
