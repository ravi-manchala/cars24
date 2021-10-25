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

  const fetchData = () => {
    Axios.get(
      "https://listing-service.qac24svc.dev/v1/filter?&variant=filterV3",
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((response) => {
      const result = arr.map((ele) => {
        return response.data.filters[ele];
      });
      setOptions(result);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log(response);
  console.log(options);

  const getBuckets = (id) => {
    // console.log(options[id].buckets);
    setBucketData(options[id].buckets);
  };

  return (
    <div>
      {options.map((option, index) => {
        return (
          <div key={option.name}>
            <button onClick={() => getBuckets(index)}>
              {option.displayName}
            </button>
            {bucketData &&
              bucketData.map((ele) => {
                return (
                  <div>
                    <h6>{ele.name}</h6>
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

export default Filters;
