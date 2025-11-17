import Link from 'next/link'
import React from 'react'

const Welcome = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8 flex flex-col items-center justify-center '>
      <h1 className='text-4xl font-bold mb-5 text-white'>Welcome to my website</h1>
      <div className='flex gap-10'>
        <Link href={'/items'}
          className={'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md px-6 py-2.5 rounded-md h-fit'}
        >
          Items
        </Link>
        <Link href={'/focus'}
          className={'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md px-6 py-2.5 rounded-md h-fit'}
        >
          Focus
        </Link>
      </div>
    </div>
  )
}

export default Welcome