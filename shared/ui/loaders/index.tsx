/* eslint-disable react/prop-types */
import React from 'react'

const Loader = ({
  type = 'spinner',
  size = 'md',
  color = 'blue',
  text = '',
  fullScreen = false,
  overlay = false
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',  
    gray: 'text-gray-600',
    white: 'text-white'
  }

  const SpinnerLoader = () => (
    <div  
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size as keyof typeof sizeClasses]} ${colorClasses[color as keyof typeof colorClasses]}`}
    />
  )

  const DotsLoader = () => (
    <div className='flex space-x-1'>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`rounded-full animate-bounce ${colorClasses[color as keyof typeof colorClasses]} bg-current`}
          style={{
            width:
              size === 'xs' ? '4px' : size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '12px',
            height:
              size === 'xs' ? '4px' : size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '12px',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )

  const PulseLoader = () => (
    <div
      className={`animate-pulse rounded-full bg-current ${sizeClasses[size as keyof typeof sizeClasses]} ${colorClasses[color as keyof typeof colorClasses]} opacity-75`}
    />
  )

  const BarsLoader = () => (
    <div className='flex items-end space-x-1'>
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className={`bg-current ${colorClasses[color as keyof typeof colorClasses]} animate-pulse`}
          style={{
            width:
              size === 'xs' ? '2px' : size === 'sm' ? '3px' : size === 'md' ? '4px' : size === 'lg' ? '5px' : '6px',
            height:
              size === 'xs' ? '12px' : size === 'sm' ? '16px' : size === 'md' ? '20px' : size === 'lg' ? '24px' : '28px',
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )

  const RingLoader = () => (
    <div
      className={`animate-spin rounded-full border-4 border-gray-200 ${sizeClasses[size as keyof typeof sizeClasses]}`}
    >
      <div
        className={`rounded-full border-4 border-transparent border-t-current ${sizeClasses[size as keyof typeof sizeClasses]} ${colorClasses[color as keyof typeof colorClasses]}`}
      />
    </div>
  )

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return <DotsLoader />
      case 'pulse':
        return <PulseLoader />
      case 'bars':
        return <BarsLoader />
      case 'ring':
        return <RingLoader />
      default:
        return <SpinnerLoader />
    }
  }

  const LoaderContent = () => (
    <div
      className={`flex flex-col items-center justify-center ${text ? 'space-y-3' : ''}`}
    >
      {renderLoader()}
      {text && (
        <p
          className={`text-sm font-medium ${colorClasses[color as keyof typeof colorClasses]} animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
        <LoaderContent />
      </div>
    )
  }

  if (overlay) {
    return (
      <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <LoaderContent />
        </div>
      </div>
    )
  }

  return <LoaderContent />
}

export const ButtonLoader = ({ size = 'sm', color = 'white' }) => (
  <Loader type='spinner' size={size} color={color} />
)

export const PageLoader = ({ text = 'Loading...' }) => (
  <Loader type='spinner' size='lg' color='blue' text={text} fullScreen />
)

export const OverlayLoader = ({ text = 'Please wait...' }) => (
  <Loader type='spinner' size='lg' color='blue' text={text} overlay />
)

export const TableLoader = () => (
  <div className='flex justify-center items-center py-8'>
    <Loader type='spinner' size='md' color='gray' text='Loading data...' />
  </div>
)

export const CardLoader = () => (
  <div className='flex justify-center items-center p-6'>
    <Loader type='dots' size='md' color='blue' />
  </div>
)

export { default as Preloader } from './Preloader'
export default Loader
