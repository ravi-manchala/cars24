import React, { useState } from "react";
import classes from "./Filters.module.css";

const Filters = (props) => {
  const { filters, filter_modal_Close } = props;
  // console.log(filters);
  const [optionName, setOptionName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [suggestionData, setSuggestionsData] = useState();
  const [bucketData, setBucketData] = useState();

  const optionsData = (index) => {
    setOptionName(filters[index].name);
    setFilterType(filters[index].filterType);
    setSuggestionsData(filters[index].suggestions);
    setBucketData(filters[index].buckets);
  };

  // console.log(filters);
  // console.log(filterType);
  // console.log(optionName);
  // console.log(filterType);
  // console.log(suggestionData);
  // console.log(bucketData);

  const suggestionUrlData = (index, filterType) => {
    props.suggestionsUrlHandler({
      value: {
        filterType: filterType,
        name: optionName,
        min: suggestionData[index].min,
        max: suggestionData[index].max,
      },
    });
  };

  const checkboxUrldata = (brandname) => {
    // console.log(brandname);
    if (brandname.subFacet) {
      props.checkBoxUrlHandler({
        name: optionName,
        values: [
          {
            name: brandname.name,
            models: brandname.subFacet.buckets.map((val) => val.name),
          },
        ],
      });
    } else {
      props.checkBoxUrlHandler({
        name: optionName,
        model: brandname.name,
      });
    }
  };

  const modelCheckBoxdata = (brandName, index) => {
    // console.log(brandName.subFacet.buckets[index].name);
    // props.modelCheckBoxUrlHandler({
    //   name: optionName,
    //   values: [
    //     {
    //       name: brandName.name,
    //       modelName: brandName.subFacet.buckets[index].name,
    //     },
    //   ],
    // });
  };

  return (
    <div className={classes.filter_modal_ui}>
      <div className={classes.heading}>
        <img
          onClick={filter_modal_Close}
          src="https://consumer-web-ae.qac24svc.dev/ae/static/js/8e795214a56ae869b2f276365fe7eca0.svg"
          alt="close"
        ></img>
        <p>Filters</p>
      </div>
      <div className={classes.optionsForm}>
        <div className={classes.options}>
          {filters.map((option, index) => {
            return (
              <div key={option.name} className={classes.optionBtn}>
                <p onClick={() => optionsData(index)}>{option.displayName}</p>
              </div>
            );
          })}
        </div>
        <div className={classes.suggestions_bucketData}>
          <div>
            {suggestionData &&
              filterType === "rf" &&
              suggestionData.map((suggestion, index) => {
                return (
                  <div key={suggestion.name}>
                    <input
                      type="radio"
                      name="suggestion"
                      id={suggestion.name}
                      value={suggestion.name}
                      onChange={() => suggestionUrlData(index, filterType)}
                    />
                    <label htmlFor={suggestion.name}>{suggestion.name}</label>
                  </div>
                );
              })}
          </div>
          <div>
            {suggestionData &&
              filterType === "sf" &&
              suggestionData.map((suggestion) => {
                return (
                  <div key={suggestion.name}>
                    {suggestion.subFacet.buckets.map((model) => {
                      return (
                        <div key={model.name}>
                          <input
                            type="checkbox"
                            name={model.name}
                            id={model.name}
                            value={model.name}
                          />
                          <label htmlFor={model.name}>
                            {suggestion.name} {model.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>

          <div>
            {bucketData &&
              bucketData.map((brandName) => {
                return (
                  <div
                    className={classes.brand_modal_name}
                    key={brandName.name}
                  >
                    <div className={classes.car_brand_name}>
                      <input
                        type="checkbox"
                        id={brandName.name}
                        name={brandName.name}
                        value={brandName.name}
                        onChange={() => checkboxUrldata(brandName)}
                      />
                      <label htmlFor={brandName.name}>{brandName.name}</label>
                    </div>
                    <div>
                      {brandName.subFacet &&
                        brandName.subFacet.buckets.map((model, index) => {
                          return (
                            <div
                              key={model.name}
                              className={classes.car_modal_name}
                            >
                              <input
                                type="checkbox"
                                id={model.name}
                                name={model.name}
                                value={model.name}
                                onChange={() =>
                                  modelCheckBoxdata(brandName, index)
                                }
                                // checked={
                                //   props.selectedFilters &&
                                //   props.selectedFilters[ele.name] &&
                                //   props.selectedFilters[ele.name]
                                // }
                              />
                              <label htmlFor={model.name}>{model.name}</label>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className={classes.btns}>
        <div>
          <button className={classes.clearbtn}>
            <span>CLEAR ALL</span>
          </button>
        </div>
        <div>
          <button className={classes.showcarsbtn}>
            <span>SHOW CARS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
