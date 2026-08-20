'use client'
import { forwardRef, useEffect, useId, useState } from 'react'
import Select, { components } from 'react-select'
import IconSelectArrow from '@/shared/icon/selectArrow'

type CustomSelectProps = {
  className?: string
  parentClass?: string
  size?: 'sm'
  customLabel?: string
  components?: Record<string, unknown>
  onChange?: (selectedOption: unknown) => void
  value?: unknown
  [key: string]: any
}

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <span className="text-neutral-light w-6">
        <IconSelectArrow />
      </span>
    </components.DropdownIndicator>
  )
}

const CustomMenuList = (props: any) => {
  function handleScroll(e: any) {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollHeight - scrollTop <= clientHeight + 1 && typeof props.selectProps?.onMenuScrollToBottom === 'function') {
      props.selectProps.onMenuScrollToBottom(e)
    }
  }

  return <components.MenuList {...props} innerProps={{ ...props?.innerProps, onScroll: handleScroll }} />
}
const CustomSelect = forwardRef<any, CustomSelectProps>(({ className, parentClass, size, customLabel, components, ...rest }, ref) => {
  const instanceId = useId()
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleChange = (selectedOption: unknown) => {
    setHasValue(!!selectedOption)
    rest?.onChange(selectedOption)
  }

  useEffect(() => {
    if (Object.keys(rest?.value || {})?.length) {
      setHasValue(!!rest.value)
    }
  }, [rest?.value])
  return (
    <div
      className={`${customLabel ? `floating-label-select relative ${isFocused || hasValue ? 'focused' : ''}` : ''} ${parentClass || ''}`}
    >
      {customLabel && (
        <label
          className={`custom-lable absolute pointer-events-none top-1/2 start-4 z-2 ${isFocused ? 'text-primary' : className?.includes('select-light') ? 'text-neutral-white/70' : 'text-light-400'} ${isFocused || hasValue ? '-translate-y-full pb-1 text-base' : 'text-lg -translate-y-1/2'}`}
        >
          {customLabel}
        </label>
      )}
      <Select
        ref={ref}
        instanceId={instanceId}
        className={`${className} custom-select-container size-${size}`}
        classNamePrefix="custom-select"
        components={{ DropdownIndicator, MenuList: CustomMenuList, ...components }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        menuPlacement="auto"
        // menuIsOpen
        // captureMenuScroll={true}
        // onMenuScrollToBottom
        // onMenuScrollToBottom={}
        // getOptionLabel={}
        {...rest}
        onChange={handleChange}
      />
    </div>
  )
})
CustomSelect.displayName = 'CustomSelect'

export default CustomSelect
