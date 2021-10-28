import React, { useState } from "react";
import classes from "./Filters.module.css";

const Filters = (props) => {
  const { options } = props;
  const [bucketData, setBucketData] = useState();
  const [suggestions, setSuggestions] = useState();

  // console.log(options);

  const getBuckets = (id) => {
    // console.log(id);
    setBucketData(options[id].buckets);
    setSuggestions(options[id].suggestions);
  };

  // console.log(suggestions);
  // console.log(bucketData);

  return (
    <div>
      <div className={classes.heading}>
        <img
          src="https://consumer-web-ae.qac24svc.dev/ae/static/js/8e795214a56ae869b2f276365fe7eca0.svg"
          alt="close"
        ></img>
        <p>Filters</p>
      </div>
      <div className={classes.optionsForm}>
        <div className={classes.options}>
          {options.map((option, index) => {
            return (
              <div key={option.name} className={classes.optionBtn}>
                <p onClick={() => getBuckets(index)}>{option.displayName}</p>
              </div>
            );
          })}
        </div>
        <div className={classes.suggestions_bucketData}>
          <div>
            {suggestions &&
              suggestions.map((suggestion) => {
                return (
                  <div>
                    {suggestion.subFacet &&
                      suggestion.subFacet.buckets.map((model) => {
                        return (
                          <div key={model.name}>
                            <label htmlFor={model.name} />
                            <input
                              type="checkbox"
                              name={model.name}
                              id={model.name}
                            />
                            {suggestion.name}
                            {model.name}
                          </div>
                        );
                      })}
                    <div>
                      <label htmlFor={suggestion.name} />
                      <input
                        type="checkbox"
                        name={suggestion.name}
                        id={suggestion.name}
                      />
                      {suggestion.name}
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            {bucketData &&
              bucketData.map((ele) => {
                return (
                  <div>
                    <label htmlFor={ele.name} />
                    <input type="checkbox" name={ele.name} id={ele.name} />
                    {ele.name}
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
