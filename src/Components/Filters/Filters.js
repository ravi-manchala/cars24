import React, { useState, useEffect } from "react";
import Axios from "axios";
import classes from "./Filters.module.css";

const arr = [
  "make",
  "quotedPrice",
  "year",
  "bodyType",
  "odometerReading",
  "carColor",
  "fuelType",
  "transmissionType",
  "optionsType",
  "engine",
  "doorsAndSeats",
  "discount",
];

const Filters = () => {
  const [options, setOptions] = useState([]);
  const [bucketData, setBucketData] = useState();
  const [suggestions, setSuggestions] = useState();

  const fetchData = () => {
    Axios.get(
      "https://listing-service.qac24svc.dev/v1/filter?&variant=filterV3",
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((response) => {
      // console.log(response);
      const result = arr.map((ele) => {
        return response.data.filters[ele];
      });
      setOptions(result);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <div>
          {options.map((option, index) => {
            return (
              <div key={option.name} className={classes.options}>
                <p onClick={() => getBuckets(index)}>{option.displayName}</p>
              </div>
            );
          })}
        </div>
        {/* <div className={classes.searchfield}>
          <img
            src="https://consumer-web-ae.qac24svc.dev/ae/static/js/7a474f42e85666256164022bf2d3c604.svg"
            alt="search"
          />
          <input type="text" placeholder="Search by Brand or Model" />
        </div> */}
        <div className={classes.suggestions}>
          {suggestions &&
            suggestions.map((suggestion) => {
              return (
                <div>
                  {suggestion.subFacet &&
                    suggestion.subFacet.buckets.map((model) => {
                      return (
                        <div key={model.name}>
                          {/* <h6>
                            {suggestion.name} {model.name}
                          </h6> */}
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
                  {/* <h6>{suggestion.name}</h6> */}
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

//
