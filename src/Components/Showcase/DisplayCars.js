import React, { useState, useEffect } from "react";
import Axios from "axios";
import classes from "./DisplayCars.module.css";
import Card from "./Card";
import Filters from "../Filters/Filters";

import InfiniteScroll from "react-infinite-scroller";
import Modal from "react-modal";

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

const DisplayCars = () => {
  // Used cars data API state
  const [data, setData] = useState([]);
  const [hasMore, setHasmore] = useState(true);

  //Fiilter Data API state
  const [options, setOptions] = useState([]);

  const [filtersCompOpen, setFiltersCompOpen] = useState(false);

  //Used cars data API call
  const usedCarsData = (page) => {
    Axios.get(
      `https://listing-service.qac24svc.dev/v1/vehicle?sf=city:DU_DUBAI&size=25&spath=buy-used-cars-dubai&variant=filterV3&page=${page}`,
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((resp) => {
      if (resp.data.results.length < 25) {
        setHasmore(false);
      }
      setData([...data, ...resp.data.results]);
    });
  };

  //Filters API call
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

  const filterOpen = () => {
    setFiltersCompOpen(true);
  };

  return (
    <div className={classes.container}>
      <div className={classes.options}>
        {options.map((option, index) => {
          return (
            <div key={option.name} className={classes.optionBtn}>
              <p>
                <span onClick={filterOpen}>{option.displayName}</span>
                <img
                  src="https://consumer-web-ae.qac24svc.dev/ae/static/js/6fae39b71885d4edcd60fe0f00851390.svg"
                  alt="arrow"
                />
              </p>
            </div>
          );
        })}
      </div>
      <div className={classes.headers}>
        <h3>Used Cars in Dubai</h3>
        <h3>
          <span>Change</span>
        </h3>
      </div>

      <Modal
        className={classes.modal}
        isOpen={filtersCompOpen}
        onRequestClose={() => setFiltersCompOpen(false)}
        ariaHideApp={false}
      >
        <Filters options={options} />
      </Modal>

      <InfiniteScroll pageStart={0} loadMore={usedCarsData} hasMore={hasMore}>
        {data.map((card) => {
          return <Card key={card.appointmentId} card={card} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default DisplayCars;
