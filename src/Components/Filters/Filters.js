import React, { useState } from "react";
import classes from "./Filters.module.css";
import Modal from "react-modal";

const Filters = (props) => {
  const { filters, filter_modal_Close } = props;
  // console.log(props.selectedFilter);
  // console.log(Object.keys(props.selectedFilter));
  // console.log(filters);

  const [optionName, setOptionName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [suggestionData, setSuggestionsData] = useState();
  const [bucketData, setBucketData] = useState();
  const [clear_Filters_Modal, setClear_Filters_Modal] = useState(false);
  const [clearSelectedFilter, setClearSelectedFilter] = useState([]);

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

  // console.log(clearSelectedFilter);

  let selectedFiltersArraya = [];
  Object.keys(props.selectedFilter).forEach((selected) => {
    filters.find((filter) => {
      if (filter.name === selected) {
        selectedFiltersArraya.push({
          name: selected,
          displayName: filter.displayName,
        });
      }
    });
  });
  // console.log(selectedFiltersArraya);

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

  const clearModalOpen = () => {
    setClear_Filters_Modal(true);
    setClearSelectedFilter(selectedFiltersArraya);
  };

  const clearModalClose = () => {
    setClear_Filters_Modal(false);
  };

  const unSelectFilters = (selected) => {
    let clearRemainFilters = clearSelectedFilter.filter(
      (it) => it.displayName !== selected.displayName
    );
    setClearSelectedFilter(clearRemainFilters);
  };

  const removeSelectedFilters = () => {
    setClear_Filters_Modal(false);
    clearSelectedFilter.map(
      (filter) => delete props.selectedFilter[filter.name]
    );
    props.urlStringFunc(props.selectedFilter);
  };
  // console.log(props.selectedFilter);

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
            {suggestionData && (
              <h5 className={classes.suggestions_heading}>Suggestions</h5>
            )}
          </div>
          <div>
            {suggestionData &&
              filterType === "rf" &&
              suggestionData.map((suggestion, index) => {
                return (
                  <div
                    key={suggestion.name}
                    className={classes.radioBtn_design}
                  >
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
                    <label
                      htmlFor={suggestion.name}
                      className={classes.radioBtn_label}
                    >
                      {suggestion.name}
                    </label>
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
                        <div
                          key={model.name}
                          className={classes.checkBox_design}
                        >
                          <input
                            type="checkbox"
                            name={model.name}
                            id={model.name}
                            value={model.name}
                            onChange={() =>
                              modelCheckBoxdata(suggestion, model)
                            }
                            checked={
                              props.selectedFilter &&
                              props.selectedFilter[optionName] &&
                              props.selectedFilter[optionName].find((brand) => {
                                return brand.models.includes(model.name);
                              })
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
            <div>
              {suggestionData && filterType === "sf" && (
                <h5 className={classes.all_brands_heading}>All Brands</h5>
              )}
            </div>
            {bucketData &&
              bucketData.map((brandName) => {
                return (
                  <div
                    className={classes.brand_modal_name}
                    key={brandName.name}
                  >
                    <div
                      className={
                        (classes.car_brand_name, classes.checkBox_design)
                      }
                    >
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
                            if (it.models) {
                              if (
                                it.models.length ===
                                brandName.subFacet.buckets.length
                              ) {
                                return true;
                              }
                            }
                            if (it) {
                              if (it === brandName.name) {
                                return "true";
                              }
                            }
                          })
                        }
                      />
                      <label
                        htmlFor={brandName.name}
                        className={classes.car_brand_label_design}
                      >
                        {brandName.name}
                      </label>
                    </div>
                    <div>
                      {brandName.subFacet &&
                        brandName.subFacet.buckets.map((model) => {
                          return (
                            <div
                              key={model.name}
                              className={
                                (classes.car_modal_name,
                                classes.checkBox_design)
                              }
                            >
                              <input
                                type="checkbox"
                                id={model.name}
                                name={model.name}
                                value={model.name}
                                onChange={() =>
                                  modelCheckBoxdata(brandName, model)
                                }
                                checked={
                                  props.selectedFilter &&
                                  props.selectedFilter[optionName] &&
                                  props.selectedFilter[optionName].find(
                                    (brand) => {
                                      return brand.models.includes(model.name);
                                    }
                                  )
                                }
                              />
                              <label
                                htmlFor={model.name}
                                className={classes.car_modal_label_design}
                              >
                                {model.name}
                              </label>
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
          <button className={classes.clearbtn} onClick={clearModalOpen}>
            <span>CLEAR ALL</span>
          </button>
        </div>
        <div>
          <button
            className={classes.showcarsbtn}
            onClick={props.usedCarsData}
            disabled={props.count === 0}
          >
            {props.count === 0 ? (
              <span>NO CARS AVAILABLE</span>
            ) : (
              <span>SHOW {props.count} CARS</span>
            )}
          </button>
        </div>
      </div>
      <Modal
        className={classes.modal}
        isOpen={clear_Filters_Modal}
        ariaHideApp={false}
      >
        <div className={classes.clear_modal_component}>
          <div className={classes.clear_modal_component_heading}>
            <h4>Clear Filters</h4>
          </div>
          <div className={classes.clear_modal_component_paragraph}>
            <p>Would you like to clear following filters?</p>
          </div>
          <div>
            {selectedFiltersArraya &&
              selectedFiltersArraya.map((selected, index) => {
                return (
                  <div className={classes.checkBox_design}>
                    <input
                      type="checkbox"
                      onChange={() => unSelectFilters(selected, index)}
                      checked={clearSelectedFilter.find(
                        (it) => it.displayName === selected.displayName
                      )}
                    />
                    <label>{selected.displayName}</label>
                  </div>
                );
              })}
          </div>
          <div className={classes.btns}>
            <div>
              <button onClick={clearModalClose} className={classes.clearbtn}>
                <span>Cancel</span>
              </button>
            </div>
            <div>
              <button
                onClick={removeSelectedFilters}
                className={classes.showcarsbtn}
              >
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Filters;
