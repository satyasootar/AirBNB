


// eslint-disable-next-line no-unused-vars
export const Features = ({icon: Icon, title, strikethrough}) => {
    return (
        <div className='flex gap-6 items-center mt-6 justify-start'>
            <Icon strokeWidth='1.5px' />
            <div className={`text-gray-800 ${strikethrough ? "line-through": ""} `} >{title}</div>
        </div> 
    )
}


