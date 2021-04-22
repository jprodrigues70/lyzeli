import { Link } from "react-router-dom"
import "./style.sass"

export default function (props) {
  return (
    <header className={`c-header ${props.className || ''}`}>
      <Link to="/">Logo</Link>
      <nav className="c-header__nav">
        <ul className="c-header__ul">
          <li className="c-header__li">
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
