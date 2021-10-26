import React, { useState, useEffect } from "react";
import Axios from "axios";

const arr = [
  "make",
  "finance",
  "year",
  "bodyType",
  "odometerReading",
  "carColor",
  "fuelType",
  "transmissionType",
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

  console.log(options);

  const getBuckets = (id) => {
    setBucketData(options[id].buckets);
    setSuggestions(options[id].suggestions);
  };

  console.log(suggestions);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        {options.map((option, index) => {
          return (
            <div key={option.name}>
              <div>
                <button onClick={() => getBuckets(index)}>
                  {option.displayName}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div>
          {suggestions &&
            suggestions.map((suggestion) => {
              return (
                <div>
                  {suggestion.subFacet &&
                    suggestion.subFacet.buckets.map((model) => {
                      return (
                        <div>
                          <h6>
                            {suggestion.name} {model.name}
                          </h6>
                        </div>
                      );
                    })}
                </div>
              );
            })}
        </div>
        <div>
          {bucketData &&
            bucketData.map((ele) => {
              return (
                <div>
                  <h6>{ele.name}</h6>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
