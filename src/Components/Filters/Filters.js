import React, { useState } from "react";
import classes from "./Filters.module.css";

const Filters = (props) => {
  const { filters, filter_modal_Close } = props;
  // console.log(props.selectedFilter);

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

  // if (props.selectedFilter[optionName]) {
  //   console.log(props.selectedFilter[optionName]);
  //   props.selectedFilter[optionName].map((brand) => {
  //     console.log(brand.name);
  //     console.log(brand.models);
  //     brand.models.map((model) => {
  //       console.log(model);
  //     });
  //   });
  // }

  // console.log(filters);
  // console.log(filterType);
  // console.log(optionName);
  // console.log(filterType);
  // console.log(suggestionData);
  // console.log(bucketData);

  const suggestionUrlData = (index, filterType) => {
    props.suggestionsUrlHandler({
      value: {
        price: suggestionData[index].name,
        filterType: filterType,
        name: optionName,
        min: suggestionData[index].min,
        max: suggestionData[index].max,
      },
    });
  };

  const checkboxUrldata = (brandname, model) => {
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

  const modelCheckBoxdata = (brandName, model) => {
    props.modelCheckBoxUrlHandler({
      name: optionName,
      values: [
        {
          name: brandName.name,
          models: [model.name],
        },
      ],
    });
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
                      checked={
                        props.selectedFilter &&
                        props.selectedFilter[optionName] &&
                        props.selectedFilter[optionName].find((option) => {
                          return option.price === suggestion.name;
                        })
                      }
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
                            onChange={() =>
                              modelCheckBoxdata(suggestion, model)
                            }
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
                        checked={
                          props.selectedFilter &&
                          props.selectedFilter[optionName] &&
                          props.selectedFilter[optionName].find((it) => {
                            if (it === brandName.name) {
                              return "true";
                            } else if (it.name === brandName.name) {
                              return "true";
                            }
                          })
                        }
                      />
                      <label htmlFor={brandName.name}>{brandName.name}</label>
                    </div>
                    <div>
                      {brandName.subFacet &&
                        brandName.subFacet.buckets.map((model) => {
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
                                  modelCheckBoxdata(brandName, model)
                                }
                                // checked={
                                //   props.selectedFilter &&
                                //   props.selectedFilter[optionName] &&
                                //   props.selectedFilter[optionName].find(
                                //     (brand) => {
                                //       return brand.name === brandName.name;
                                //     }
                                //   )
                                // }
                                checked={
                                  props.selectedFilter &&
                                  props.selectedFilter[optionName] &&
                                  props.selectedFilter[optionName].map(
                                    (brand) => {
                                      if (brand.name === brandName.name) {
                                        brand.models.find(
                                          (model) => model === model.name
                                        );
                                      }
                                    }
                                  )
                                }
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
            <span>SHOW {props.count} CARS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
