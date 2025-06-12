import React from 'react'

const FilterLinks = ({ content }: {
    content: string
}) => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return (
        <div>
            {
                content.split(" ").map((item, index) => {
                    if (urlRegex.test(item)) {
                        return (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                key={index}
                                href={item}
                                className='text-blue-500 inline-block'
                            >
                                {item}
                            </a>
                        )
                    }
                    else {
                        return (
                            <span key={index}>{" " + item + " "}</span>
                        )
                    }
                })
            }
        </div>
    )
}

export default FilterLinks