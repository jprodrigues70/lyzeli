import "./style.sass"
export default function Card(props) {
  return (
    <div className={`c-card ${props.className || ''}`}>
      <h2>
        Survey about something that I'm interested
      </h2>
      {props.children || null}
    </div>
  )
}
