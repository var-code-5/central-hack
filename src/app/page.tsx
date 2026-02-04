import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


export default function page() {
  return (
    <div className='min-h-screen w-screen bg-black text-c-home-blue'>
      {/* hero */}
      <div className="h-screen w-screen bg-c-blue/20 px-10">
        <Image src="/home/vit.png" alt="Hero Image" height={1000} width={1000} className='w-1/3 h-auto' />
        <div className='flex flex-col gap-4 items-end text-xl text-c-home-blue font-jetbrains-mono'>
          <p className='bg-c-blue/30 p-4'>Vellore Institute of Technology (VIT) Vellore is a premier private deemed university </p>
          <p className='bg-c-blue/30 p-4'> in Tamil Nadu, India, founded in 1984 by G. Viswanathan.  </p>
          <p className='bg-c-blue/30 p-4'>Known for its top-tier engineering education,</p>
          <p className='bg-c-blue/30 p-4'>it consistently ranks among India's best</p>
        </div>
        <h1 className='uppercase'>About: vit vellore</h1>
        <Link href="https://vit.ac.in/" target='_blank' className=''>Learn more</Link>
      </div>

      {/* Yantra */}
      <div className='relative h-screen w-screen '>
      <Image src={"/home/yantra-bg.png"} alt="Yantra Image" height={1000} width={1000} className='absolute h-full w-full z-10' />
      </div>
    </div>
  )
}
