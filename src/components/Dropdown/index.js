import React, { useState, useEffect } from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import "./style.scss";

const DropdownSelect = ({ data }) => {
  const { currentUser, items, comment, setSelectedComment } =
    data;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    if (currentUser) {
      
    }
  }, [items, comment, currentUser ]);

  const handleAction = (item, comment) => {
    if (comment) {
      setSelectedComment(comment);
      item.action(comment);
      return;
    }
    item.action();
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="action-button">
      <DropdownToggle className="action-trigger">
        <i className="fas fa-ellipsis-h"></i>
      </DropdownToggle>
      <DropdownMenu right>
        {items.map((item) => {
          // console.log(item);
          if (item.access) {
            return (
              <div
                key={item.name}
                className="dropitem"
                onClick={() => handleAction(item, comment)}
              >
                {item.icon}
                <span className="text">{item.name}</span>
              </div>
            );
          } else {
            return null
          }
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownSelect;
