import React, { ReactElement } from 'react'

const Header = ({name,buttonComponent,isSmallText=false}:{
  name:string,
  buttonComponent:ReactElement,
  isSmallText?:boolean
}) => {
  return (
    <div className='flex w-full items-center py-6  justify-between'>
        <h1 className={`${isSmallText? 'text-lg' : 'text-xl'} font-semibold text-white`}>{name}</h1>
       <div> {buttonComponent}</div>
    </div>
  )
}

export default Header