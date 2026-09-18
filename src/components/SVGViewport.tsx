import { useRef, useState, type MouseEvent, type WheelEvent } from 'react'

//レイヤー型宣言
interface AbstractLayer {
  id: string,
  visible: boolean,}

interface DynamicLayer extends AbstractLayer {
  type: 'dynamic',
  children: (arg0: DynamicChildrenArgs) => React.ReactElement
}

interface StaticLayer extends AbstractLayer {
  type: 'static',
  children: React.ReactElement
}

export type Layer = StaticLayer | DynamicLayer

export interface DynamicChildrenArgs {
  x: number,
  y: number,
  scale: number
}

//内部用型とか定数とか
type V2d={x:number,y:number}

const easeOutExpo = 'cubic-bezier(0.16, 1, 0.3, 1)'
const easeOutQuint = 'cubic-bezier(0.22, 1, 0.36, 1)'

//本体
export default function SVGViewport({
  elements, width = '100%', height = '100%'
}: {
  elements: Layer[],
  width?: string,
  height?: string
}) {
  //へんすー
  const mouseDown = useRef(false)
  const start = useRef<V2d>({ x: 0, y: 0 })
  const [drag, setDrag] = useState<V2d>({ x: 0, y: 0 })
  const [staticOffset, setStaticOffset] = useState<V2d>({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)

  //コンテナのonMouseMoveとonMouseDown
  function dragUpdate(e: MouseEvent) {
    if (!mouseDown.current) return;
    setDrag({
      x: drag.x + (e.clientX - start.current.x) / scale,
      y: drag.y + (e.clientY - start.current.y) / scale
    })
    start.current = { x: e.clientX, y: e.clientY }
  }

  //コンテナのonWheel
  function wheelUpdate(e: WheelEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()

    const mouse: V2d = {
      x: e.clientX - (rect.left + rect.width / 2),
      y: e.clientY - (rect.top + rect.height / 2)
    }

    const factor = e.deltaY < 0 ? 1.1 : 0.9

    const oldScale = scale
    const newScale = Math.min(Math.max(oldScale * factor, 0.1), 10)

    const scaleRatio = newScale / oldScale

    setStaticOffset(prev => ({
      x: mouse.x - (mouse.x - prev.x) * scaleRatio,
      y: mouse.y - (mouse.y - prev.y) * scaleRatio,
    }))

    setScale(newScale)
  }

  //本体の本体
  return <div
      className='svgContainer'
      onMouseDown={(e)=>{
        mouseDown.current = true
        start.current = { x: e.clientX, y: e.clientY }
      }}
      onMouseMove={dragUpdate}
      onMouseUp={()=>{mouseDown.current=false}}
      onWheel={wheelUpdate}
      style={{ width: width, height: height }}
      >
    <svg className='svgRoot' overflow='hidden' width='100%' height='100%'>
      <g className='staticRoot' style={{ transform: 'translate(50%, 50%)' }}>
        <g
        className='staticOffsetApplier'
        transform={`translate(${staticOffset.x}, ${staticOffset.y})`}
        style={{ transition: 'transform .2s ' + easeOutExpo }} >
          <g
          className='scaleApplier'
          transform={`scale(${scale})`}
          style={{ transition: 'transform .2s ' + easeOutExpo }}>
            <g
            className='translateApplier'
            transform={`translate(${drag.x}, ${drag.y})`}
            style={{ transition: 'transform .4s ' + easeOutQuint }}>
              { elements.map(item => <g
              key={item.id}
              id={item.id}
              style={{ display: item.visible ? 'inline' : 'none' }}>
                {
                item.type === 'dynamic' ?
                item.children({
                  x: drag.x + staticOffset.x / scale,
                  y: drag.y + staticOffset.y / scale,
                  scale: scale
                })
                :
                item.children  
                }
              </g>) }
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
}
