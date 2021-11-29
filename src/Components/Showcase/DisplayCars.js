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

  // selected filters state
  const [selectedFilter, setSelectedFilter] = useState({});

  // Total number of cars count
  const [count, setCount] = useState();

  // console.log(selectedFilter);

  //Used cars data API call
  const usedCarsData = (page, newFiltes = null) => {
    let url = "";
    if (newFiltes) {
      setSelectedFilter(newFiltes);
      url = urlStringFunc(newFiltes);
    } else {
      url = urlStringFunc(selectedFilter);
    }

    Axios.get(
      `https://listing-service.qac24svc.dev/v1/vehicle?${url}&sf=city:DU_DUBAI&size=25&spath=buy-used-cars-dubai&variant=filterV3&page=${page}`,
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((resp) => {
      if (page === 0) {
        setData([...resp.data.results]);
      } else {
        setData([...data, ...resp.data.results]);
      }
      setFiltersCompOpen(false);
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
      // console.log(response);
      const result = arr.map((ele) => {
        return response.data.filters[ele];
      });
      setFilters(result);
      setCount(response.data.total);
    });
  };

  //size_zero_api_call
  const size_zero_filter_call = (url) => {
    Axios.get(
      `https://listing-service.qac24svc.dev/v1/vehicle?${url}&sf=city:DU_DUBAI&size=0&page=0&variant=filterV3`,
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((response) => {
      setCount(response.data.total);
    });
  };

  const checkBoxUrlHandler = (data) => {
    if (data.values) {
      let newData = {};
      if (selectedFilter[data.name]) {
        let length;
        filters.map((filter) => {
          if (filter.name === data.name) {
            filter.buckets.map((bucket) => {
              if (bucket.name === data.values[0].name) {
                length = bucket.subFacet.buckets.length;
              }
              return bucket;
            });
          }
          return filter;
        });
        let modelLength = selectedFilter[data.name].find(
          (it) => it.models.length === length
        );
        let filtered = selectedFilter[data.name].find(
          (brand) => brand.name === data.values[0].name
        );

        if (filtered && modelLength) {
          newData = {
            ...selectedFilter,
            [data.name]: selectedFilter[data.name].filter(
              (brand) => brand.name !== data.values[0].name
            ),
          };
          if (newData[data.name].length === 0) {
            delete newData[data.name];
          }
        } else if (filtered) {
          newData = {
            ...selectedFilter,
            [data.name]: [...data.values],
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
      const url = urlStringFunc(newData);
      size_zero_filter_call(url);
    } else {
      let newData = {};
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
            delete newData[data.name];
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
      const url = urlStringFunc(newData);
      size_zero_filter_call(url);
    }
  };

  const suggestionsUrlHandler = (data) => {
    let newData = {
      ...selectedFilter,
      [data.value.name]: [data.value],
    };
    setSelectedFilter(newData);
    const url = urlStringFunc(newData);
    size_zero_filter_call(url);
  };

  const modelCheckBoxUrlHandler = (data) => {
    let newData = {};
    if (selectedFilter[data.name]) {
      const filtered = selectedFilter[data.name].find(
        (it) => it.name === data.values[0].name
      );
      if (filtered) {
        let included = selectedFilter[data.name].find((it) =>
          it.models.includes(data.values[0].models[0])
        );
        if (included) {
          newData = {
            ...selectedFilter,
            [data.name]: selectedFilter[data.name].map((it) => {
              return {
                ...it,
                models: it.models.filter(
                  (model) => model !== data.values[0].models[0]
                ),
              };
            }),
          };

          newData[data.name].filter((it, index) => {
            if (it.models.length === 0) {
              return newData[data.name].splice(index, 1);
            } else {
              return it;
            }
          });

          if (newData[data.name].length === 0) {
            delete newData[data.name];
          }
        } else {
          newData = {
            ...selectedFilter,
            [data.name]: selectedFilter[data.name].map((it) => {
              if (it.name === data.values[0].name) {
                return {
                  ...it,
                  models: [...it.models, ...data.values[0].models],
                };
              } else {
                return it;
              }
            }),
          };
        }
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
    const url = urlStringFunc(newData);
    size_zero_filter_call(url);
  };

  const clear_selected_model = (key, modelName) => {
    let newData = {
      ...selectedFilter,
      [key]: selectedFilter[key].map((it) => {
        return {
          ...it,
          models: it.models.filter((model) => model !== modelName),
        };
      }),
    };

    newData[key].filter((it, index) => {
      if (it.models.length === 0) {
        return newData[key].splice(index, 1);
      } else {
        return it;
      }
    });

    if (newData[key].length === 0) {
      delete newData[key];
    }
    console.log(newData);
    usedCarsData(0, newData);
  };

  const clear_selected_type = (key, val) => {
    let newData = {};
    let selected = selectedFilter[key].filter((it) => it !== val);
    newData = {
      ...selectedFilter,
      [key]: selected,
    };
    if (selected.length === 0) {
      delete newData[key];
    }
    usedCarsData(0, newData);
  };

  const clear_selected_priceKmYear = (key) => {
    let newData = {
      ...selectedFilter,
    };
    delete newData[key];
    usedCarsData(0, newData);
  };

  const clear_All_filters = () => {
    let newData = { ...selectedFilter };
    Object.keys(selectedFilter).map((filter) => delete newData[filter]);
    usedCarsData(0, newData);
  };

  const urlStringFunc = (newData) => {
    let urlString = "";
    Object.keys(newData).forEach((key) => {
      if (key === "make") {
        let paramString = "sf=";
        paramString += `${key}:`;
        let lastElement = newData[key][newData[key].length - 1];
        newData[key].forEach((value) => {
          paramString += `${value.name}-sub-model:`;
          paramString += value.models.join(";");
          if (value !== lastElement) {
            paramString += `-or-${key}:`;
          }
        });
        if (urlString) {
          urlString += "&" + paramString;
        } else {
          urlString += paramString;
        }
      }
      if (
        key === "quotedPrice" ||
        key === "year" ||
        key === "odometerReading"
      ) {
        newData[key].forEach((value) => {
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
        if (urlString) {
          urlString += "&" + paramString;
        } else {
          urlString += paramString;
        }
      }
    });
    return urlString;
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

  const remove_filters_selected_in_clear_model = (data) => {
    let newData = { ...selectedFilter };
    data.map((filter) => delete newData[filter.name]);
    setSelectedFilter(newData);
    const url = urlStringFunc(newData);
    size_zero_filter_call(url);
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

      <div>
        {Object.keys(selectedFilter).length > 0 && (
          <div className={classes.selected_options}>
            <div className={classes.clear_All_otn}>
              <h5 onClick={clear_All_filters}>Clear All</h5>
            </div>
            <div className={classes.selected_filter_items}>
              {Object.keys(selectedFilter).length > 0 &&
                Object.keys(selectedFilter).map((key) => {
                  if (key === "make") {
                    return selectedFilter[key].map((val) =>
                      val.models.map((model) => {
                        return (
                          <div key={model} className={classes.filter_item}>
                            <p>
                              {`${val.name} ${model}`}{" "}
                              <span>
                                <img
                                  onClick={() =>
                                    clear_selected_model(key, model)
                                  }
                                  src="https://consumer-web-ae.qac24svc.dev/ae/static/js/6a6d198249093bff9ae2c18dd52f9d2e.svg"
                                  alt="Close"
                                />
                              </span>
                            </p>
                          </div>
                        );
                      })
                    );
                  }
                  if (key === "quotedPrice") {
                    return (
                      <div
                        key={selectedFilter[key][0].price}
                        className={classes.filter_item}
                      >
                        <p>
                          {`AED ${selectedFilter[key][0].min} - AED ${selectedFilter[key][0].max}`}{" "}
                          <span>
                            <img
                              onClick={() => clear_selected_priceKmYear(key)}
                              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/6a6d198249093bff9ae2c18dd52f9d2e.svg"
                              alt="Close"
                            />
                          </span>
                        </p>
                      </div>
                    );
                  }
                  if (key === "year") {
                    return (
                      <div
                        key={selectedFilter[key][0].price}
                        className={classes.filter_item}
                      >
                        <p>
                          {selectedFilter[key][0].price}{" "}
                          <span>
                            <img
                              onClick={() => clear_selected_priceKmYear(key)}
                              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/6a6d198249093bff9ae2c18dd52f9d2e.svg"
                              alt="Close"
                            />
                          </span>
                        </p>
                      </div>
                    );
                  }
                  if (key === "odometerReading") {
                    return (
                      <div
                        key={selectedFilter[key][0].price}
                        className={classes.filter_item}
                      >
                        <p>
                          {`${selectedFilter[key][0].min} KMs - ${selectedFilter[key][0].max} KMs`}{" "}
                          <span>
                            <img
                              onClick={() => clear_selected_priceKmYear(key)}
                              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/6a6d198249093bff9ae2c18dd52f9d2e.svg"
                              alt="Close"
                            />
                          </span>
                        </p>
                      </div>
                    );
                  }
                  if (
                    key === "bodyType" ||
                    key === "carColor" ||
                    key === "fuelType" ||
                    key === "optionsType" ||
                    key === "transmissionType"
                  ) {
                    return selectedFilter[key].map((val) => {
                      return (
                        <div key={val} className={classes.filter_item}>
                          <p>
                            {val}{" "}
                            <span>
                              <img
                                onClick={() => clear_selected_type(key, val)}
                                src="https://consumer-web-ae.qac24svc.dev/ae/static/js/6a6d198249093bff9ae2c18dd52f9d2e.svg"
                                alt="Close"
                              />
                            </span>
                          </p>
                        </div>
                      );
                    });
                  }
                })}
            </div>
          </div>
        )}
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
          usedCarsData={() => usedCarsData(0)}
          urlStringFunc={urlStringFunc}
          remove_filters_selected_in_clear_model={
            remove_filters_selected_in_clear_model
          }
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
