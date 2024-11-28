import React, { ReactHTMLElement, useMemo, useRef, useState } from 'react'
import useIsInViewport from './useIsInViewport'

type Props = {
    itemHeight: number
    items: string[] | object[]
    viewportHeight: number
    buffer?: number
}

const VirtualScroll: React.FC<Props> = ({ itemHeight, items, viewportHeight, buffer = .2 }) => {
    const [offset, setOffset] = useState(0)

    const prevListItem = useRef<HTMLElement | null>(null)
    const isPrevIntersecting = useIsInViewport(prevListItem)

    const nextListItem = useRef<HTMLElement | null>(null)
    const isNextIntersecting = useIsInViewport(nextListItem)

    const onScreenItems = useMemo(() =>
        Math.ceil(itemHeight / viewportHeight), [itemHeight, items])

    const extraOffsetItems = useMemo(() => Math.ceil(onScreenItems * buffer), [itemHeight, items, buffer])

    return (
        <div style={{ height: viewportHeight }}>
            {items.slice(
                (offset - extraOffsetItems) > 0 ? offset - extraOffsetItems : 0,
                (offset + onScreenItems + extraOffsetItems) < items.length ? offset + onScreenItems + extraOffsetItems : items.length)
                .map((item, i: number) => {
                    return (<div key={i} style={{ height: itemHeight }}>{item}</div>)
                })
            }
        </div>
    )
}

export default VirtualScroll