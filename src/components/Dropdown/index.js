import { useState } from "react";
import { usePopper } from "react-popper";
import { ReactComponent as Settings } from "../../assets/settings.svg";
import useComponentVisible from "../../hooks/useComponentVisible";
import Btn from "../Btn";
import "./style.sass";

export default function Dropdown({ items, onSelect }) {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    placement: "top",
  });

  const select = (item) => {
    close();
    return onSelect(item);
  };

  const open = () => {
    setIsComponentVisible(true);
  };

  const close = () => {
    setIsComponentVisible(false);
  };

  const toggle = (event) => {
    return isComponentVisible ? close() : open(event);
  };

  return (
    <div className="c-dropdown" ref={ref}>
      <>
        <span
          type="button"
          ref={setReferenceElement}
          onClick={(event) => toggle(event)}
        >
          <Btn>
            <Settings />
          </Btn>
        </span>
        {isComponentVisible && (
          <div
            className="c-dropdown__content"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <ul className="c-dropdown__list">
              {items.map((item) => (
                <li
                  className="c-dropdown__list-item"
                  key={item.key}
                  onClick={() => select(item)}
                >
                  <div className="c-dropdown__list-item-container">
                    <div className="c-dropdown__list-item-content">
                      <span>{item.title}</span>
                    </div>
                    <div
                      v-if="item.description"
                      className="c-dropdown__list-item-description"
                    >
                      <small>{item.description}</small>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div ref={setArrowElement} style={styles.arrow} />
          </div>
        )}
      </>
    </div>
  );
}
