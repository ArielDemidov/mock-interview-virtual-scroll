import React, { ReactHTMLElement, useEffect, useMemo, useRef, useState } from 'react'
import useIsInViewport from './useIsInViewport'

type Props = {
    itemHeight: number
    items: string[] | object[]
    viewportHeight: number
    buffer?: number
}

const VirtualScroll: React.FC<Props> = ({ itemHeight, items, viewportHeight, buffer = .2 }) => {
    const [offset, setOffset] = useState(0)

    const prevListItem = useRef<HTMLDivElement | null>(null)
    const isPrevIntersecting = useIsInViewport(prevListItem)

    const nextListItem = useRef<HTMLDivElement | null>(null)
    const isNextIntersecting = useIsInViewport(nextListItem)

    const onScreenItems = useMemo(() =>
        Math.ceil(itemHeight / viewportHeight), [itemHeight, items])

    const extraOffsetItems = useMemo(() => Math.ceil(onScreenItems * buffer), [itemHeight, items, buffer])

    useEffect(() => {
        if (isPrevIntersecting)
            setOffset(offset - extraOffsetItems > 0 ? offset - extraOffsetItems : 0)
        if (isNextIntersecting)
            setOffset((offset + onScreenItems + extraOffsetItems) < items.length ? offset + onScreenItems + extraOffsetItems : offset + onScreenItems) // I think I have an infinite rendering loop here
    }, [isPrevIntersecting, isNextIntersecting])

    return (
        <div style={{ height: viewportHeight }}>
            {items.slice(
                (offset - extraOffsetItems) > 0 ? offset - extraOffsetItems : 0,
                (offset + onScreenItems + extraOffsetItems) < items.length ? offset + onScreenItems + extraOffsetItems : items.length)
                .map((item, i: number) => {
                    if (i + 1 === offset) return (<div key={i} style={{ height: itemHeight }} ref={prevListItem}>{item}</div>)
                    if (i - 1 === offset + onScreenItems) return (<div key={i} style={{ height: itemHeight }} ref={nextListItem}>{item}</div>)
                    return (<div key={i} style={{ height: itemHeight }}>{item}</div>)
                })
            }
        </div>
    )
}

export default VirtualScroll