import React, {useState} from "react";

const FilterSettings = () => {
  const tabsName = ['Genres', 'Countries', 'Years', 'Subgenres'];
  const [activeTab, setActiveTab] = useState(0);
  const tabs = tabsName.map((tab, index) => {
    return (
      <div className="filter-pop-up__tabs-item" key={tab} onClick={() => changeActiveTab(index)}>
        {tab}
        {activeTab === index && <span className="filter-pop-up__tabs-item--active"/>}
      </div>
    )
  });

  const changeActiveTab = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="filter-pop-up">
      <div className="filter-pop-up__header">
        <div className="filter-pop-up__tabs">
          {tabs}
        </div>
        <div className="filter-pop-up__gutter">
        </div>
      </div>
    </div>
  )
};

export default FilterSettings;
