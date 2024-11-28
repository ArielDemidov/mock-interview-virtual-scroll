import React, { useEffect, useMemo, useState } from 'react'

const useIsInViewport = (ref: React.MutableRefObject<any>) => {
    const [isIntersecting, setIsIntersecting] = useState(false)

    const observer = useMemo(
        () =>
            new IntersectionObserver(([entry]) => {
                setIsIntersecting(entry.isIntersecting)
                observer.unobserve(entry.target) // line I added
            }),
        []
    )

    useEffect(() => {
        observer.observe(ref.current)

        return () => {
            observer.disconnect()
        }
    }, [ref, observer])

    return isIntersecting
}

export default useIsInViewport