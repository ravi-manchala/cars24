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

  const [selectedFilter, setSelectedFilter] = useState({});

  // Total number of cars count
  const [count, setCount] = useState();

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

  const checkBoxUrlHandler = (data) => {
    // console.log(data);
    if (data.values) {
      let [dataValue] = data.values.map((value) => value.name);
      let newData = {};
      if (selectedFilter[data.name]) {
        if (
          selectedFilter[data.name].find((brand) => brand.name === dataValue)
        ) {
          newData = {
            ...selectedFilter,
            [data.name]: selectedFilter[data.name].filter(
              (brand) => brand.name !== dataValue
            ),
          };
        } else {
          newData = {
            ...selectedFilter,
            [data.name]: [...selectedFilter[data.name], ...data.values],
          };
        }
      } else {
        newData = {
          ...selectedFilter,
          [data.name]: data.values,
        };
      }
      setSelectedFilter(newData);
      // console.log(newData);
      urlStringFunc(newData);
    } else {
      let newData = {};
      // console.log(selectedFilter, data);
      if (selectedFilter[data.name]) {
        if (selectedFilter[data.name].includes(data.model)) {
          let selected = selectedFilter[data.name].filter(
            (it) => it !== data.model
          );
          newData = {
            ...selectedFilter,
            [data.name]: selected,
          };
          if (selected.length === 0) {
            delete selectedFilter[data.name];
          }
        } else {
          newData = {
            ...selectedFilter,
            [data.name]: [...selectedFilter[data.name], data.model],
          };
        }
      } else {
        newData = {
          ...selectedFilter,
          [data.name]: [data.model],
        };
      }
      setSelectedFilter(newData);
      urlStringFunc(newData);
    }
  };
  // console.log(selectedFilter);

  const suggestionsUrlHandler = (data) => {
    let newData = {
      ...selectedFilter,
      [data.value.name]: [data.value],
    };
    setSelectedFilter(newData);
    urlStringFunc(newData);
  };

  const modelCheckBoxUrlHandler = (data) => {
    let newData = {};
    if (selectedFilter[data.name]) {
      newData = {
        ...selectedFilter,
        [data.name]: [...selectedFilter[data.name], ...data.values],
      };
    } else {
      newData = {
        ...selectedFilter,
        [data.name]: data.values,
      };
    }
    setSelectedFilter(newData);
    console.log(newData);
    urlStringFunc(newData);
  };

  // console.log(selectedFilter);

  const urlStringFunc = (newData) => {
    let urlString = "";
    Object.keys(newData).forEach((key) => {
      if (key === "make") {
        let paramString = "sf=";
        paramString += `${key}:`;
        let lastElement = newData[key][newData[key].length - 1];
        newData[key].forEach((value) => {
          if (value.models) {
            paramString += `${value.name}-sub-model:`;
            paramString += value.models.join(";");
            if (value !== lastElement) {
              paramString += `-or-${key}:`;
            }
          } else {
            paramString += `${value.name}-sub-model:`;
            paramString += value.modelName;

            if (value !== lastElement) {
              paramString += `-or-${key}:`;
            }
          }
        });
        if (urlString) {
          urlString += "&" + paramString;
        } else {
          urlString += paramString;
        }

        // newData[key].forEach((value) => {
        //   paramString += `${value.name}-sub-model:`;
        //   paramString += value.models.join(";");
        //   if (value !== lastElement) {
        //     paramString += `-or-${key}:`;
        //   }
        // });
        // if (urlString) {
        //   urlString += "&" + paramString;
        // } else {
        //   urlString += paramString;
        // }

        // console.log(paramString);
      }
      if (
        key === "quotedPrice" ||
        key === "year" ||
        key === "odometerReading"
      ) {
        // const urlArray = [];
        newData[key].forEach((value) => {
          // console.log(value);
          let filterType = value.filterType;
          let name = value.name;
          let min = value.min;
          let max = value.max;
          let paramString = `${filterType}=${name}:${min};${max}`;
          if (urlString) {
            urlString += "&" + paramString;
          } else {
            urlString += paramString;
          }
        });
      }
      if (
        key === "bodyType" ||
        key === "carColor" ||
        key === "fuelType" ||
        key === "optionsType" ||
        key === "transmissionType"
      ) {
        let paramString = "";
        let lastElement = newData[key][newData[key].length - 1];
        paramString += `sf=${key}:`;
        newData[key].forEach((value) => {
          paramString += value;
          if (value !== lastElement) {
            paramString += `-or-${key}:`;
          }
        });
        // console.log(paramString);
        if (urlString) {
          urlString += "&" + paramString;
        } else {
          urlString += paramString;
        }
      }
    });
    console.log(urlString);
    Axios.get(
      `https://listing-service.qac24svc.dev/v1/vehicle?${urlString}&sf=city:DU_DUBAI&size=0&page=0&variant=filterV3`,
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((response) => {
      setCount(response.data.total);
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

  // console.log(selectedFilter);

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
          checkBoxUrlHandler={checkBoxUrlHandler}
          modelCheckBoxUrlHandler={modelCheckBoxUrlHandler}
          selectedFilter={selectedFilter}
          count={count}
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
