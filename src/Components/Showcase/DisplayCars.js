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

  //Fiilter Data API state
  const [filters, setFilters] = useState([]);

  //modal state
  const [filtersCompOpen, setFiltersCompOpen] = useState(false);
  const [hasMore, setHasmore] = useState(false);

  const [seleFilter, setSeleFilter] = useState({});
  //Used cars data API call
  const usedCarsData = (page) => {
    Axios.get(
      `https://listing-service.qac24svc.dev/v1/vehicle?sf=city:DU_DUBAI&size=25&spath=buy-used-cars-dubai&variant=filterV3&page=${page}`,
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((resp) => {
      setData([...data, ...resp.data.results]);
      if (resp.data.results.length < 25) {
        setHasmore(false);
      } else if (!hasMore) {
        setHasmore(true);
      }
    });
  };

  const getCount = (data) => {
    // console.log(data);
    if (data.values) {
      let newData = {};
      if (seleFilter[data.name]) {
        newData = {
          ...seleFilter,
          [data.name]: [...seleFilter[data.name], ...data.values],
        };
      } else {
        newData = {
          ...seleFilter,
          [data.name]: data.values,
        };
      }
      setSeleFilter(newData);
      let paramString = "sf=";
      Object.keys(newData).map((key) => {
        paramString += `${key}:`;
        newData[key].map((value) => {
          paramString += `${value.name}-sub-model:`;
          paramString += value.models.join(";");
        });
      });

      Axios.get(
        `https://listing-service.qac24svc.dev/v1/vehicle?sf=city:DU_DUBAI&size=0&spath=buy-used-cars-dubai&variant=filterV3&page=0&${paramString}`,
        { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
      ).then((resp) => {
        // console.log(resp.data);
      });
    } else {
      const newData = {
        ...seleFilter,
        [data.name]: data.model,
      };
      setSeleFilter(newData);
    }
    // const newData = {
    //   ...setSeleFilter,
    //   [data.name]: data.values,
    // };
    // setSeleFilter(newData);
    // console.log(newData);
    // let paramString = "sf=";
    // Object.keys(newData).map((key) => {
    //   paramString += `${key}:`;
    //   newData[key].map((value) => {
    //     paramString += `${value.name}-sub-model:`;
    //     paramString += value.models.join(";");
    //   });
    // });
    // console.log(paramString);
    // Axios.get(
    //   `https://listing-service.qac24svc.dev/v1/vehicle?sf=city:DU_DUBAI&size=0&spath=buy-used-cars-dubai&variant=filterV3&page=0&${paramString}`,
    //   { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    // ).then((resp) => {
    //   // console.log(resp.data);
    // });
  };
  // console.log(seleFilter);

  //Filters API call
  const filterData = () => {
    Axios.get(
      "https://listing-service.qac24svc.dev/v1/filter?&variant=filterV3",
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((response) => {
      // console.log(response.data.filters);
      const result = arr.map((ele) => {
        return response.data.filters[ele];
      });
      setFilters(result);
    });
  };

  // console.log(filters);

  const suggestionsUrlHandler = (selectedFilters) => {
    console.log(selectedFilters);
    console.log(Object.keys(selectedFilters));
    const urlArray = [];
    Object.keys(selectedFilters).map((selectedFilter) => {
      // console.log(selectedFilters[selectedFilter]);
      let filterType = selectedFilters[selectedFilter].filterType;
      let name = selectedFilters[selectedFilter].name;
      let min = selectedFilters[selectedFilter].min;
      let max = selectedFilters[selectedFilter].max;
      let paramStaring = `${filterType}=${name}:${min};${max}`;
      return urlArray.push(paramStaring);
    });
    // console.log(urlArray);
    let urlString = urlArray.join("&");

    Axios.get(
      `https://listing-service.qac24svc.dev/v1/vehicle?${urlString}&sf=city:DU_DUBAI&size=0&page=0&variant=filterV3`,
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((response) => {
      // console.log(response);
    });
  };

  useEffect(() => {
    filterData();
    usedCarsData(0);
  }, []);

  const filter_modal_Open = () => {
    setFiltersCompOpen(true);
  };

  const filter_modal_Close = () => {
    setFiltersCompOpen(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.options} style={{ height: "60px" }}>
        {filters.map((option) => {
          return (
            <div key={option.name} className={classes.optionBtn}>
              <p onClick={filter_modal_Open}>
                <span>{option.displayName}</span>
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
        ariaHideApp={false}
      >
        <Filters
          filters={filters}
          filter_modal_Close={filter_modal_Close}
          suggestionsUrlHandler={suggestionsUrlHandler}
          getCount={getCount}
        />
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
