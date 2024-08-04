import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Tab = ({ label, children, ...props }) => {
  return (
    <div className="nhsuk-tabs__panel" {...props}>
      {children}
    </div>
  );
};

export const Tabs = ({ children }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.substring(1));
      const childIndex = children.findIndex(
        (child) => child.props.label === id,
      );
      if (childIndex !== -1) {
        setActiveTab(childIndex);
      }
    }
  }, [children, location.hash]);

  return (
    <div className="nhsuk-tabs" data-module="nhsuk-tabs">
      <h2 className="nhsuk-tabs__title">Contents</h2>

      <ul className="nhsuk-tabs__list">
        {children.map((tab, index) => (
            <li
              key={index}
              className={`nhsuk-tabs__list-item ${index === activeTab && "nhsuk-tabs__list-item--selected"}`}
            >
              <a
                className="nhsuk-tabs__tab"
                onClick={() => handleTabClick(index)}
                href={`#${tab.props.label}`}
              >
                {tab.props.label}
              </a>
            </li>
        ))}
      </ul>
      {children[activeTab]}
    </div>
  );
};
