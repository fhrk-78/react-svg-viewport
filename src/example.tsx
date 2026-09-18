import { useState } from "react";
import SVGViewport, { type Layer } from "./components/SVGViewport";

export default function App() {
  const [hiddenShown, setHiddenShown] = useState(false)

  const elms: Layer[] = [
    {
      type: 'static',
      id: 'hidden',
      visible: hiddenShown,
      children: <g>
        <rect x='100' y='100' width='200' height='50' fill='#114514' />
        <polygon points="100,0 200,173.2 0,173.2" fill="#ff0" />
      </g>
    },
    {
      type: 'dynamic',
      id: 'example',
      visible: true,
      children: ({ x, y, scale }) => <g>
        <rect x="0" y="0" width="50" height="50" fill="blue" />
        <circle cx="0" cy="0" r="20" fill="red" />
        <circle cx={-x} cy={-y} r="100" fill="#9999" />
        <path d="M 50 100 Q 100 20 150 100 T 250 100" stroke="red" strokeWidth={`${10/scale}px`} fill="transparent" />
      </g>
    },
  ]

  return <div style={{
    position: "relative",
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: 'sans-serif'
    }}>
    <SVGViewport elements={elms} />
    <div style={{
      position: "absolute",
      bottom: '15px',
      left: '15px',
      backgroundColor: '#ddd',
      padding: '15px',
      borderRadius: '15px'
      }}>
      <label>
        Show Hidden Layer
        <input
        type="checkbox"
        checked={hiddenShown}
        onChange={e => setHiddenShown(e.currentTarget.checked)} />
      </label>
    </div>
  </div>
}
