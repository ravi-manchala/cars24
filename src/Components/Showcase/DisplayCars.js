import React, { useState } from "react";
import Axios from "axios";
import classes from "./DisplayCars.module.css";
import InfiniteScroll from "react-infinite-scroller";
import Card from "./Card";

const DisplayCars = () => {
  const [data, setData] = useState([]);
  const [hasMore, setHasmore] = useState(true);
  const getData = (page) => {
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

  return (
    <div className={classes.container}>
      <div className={classes.headers}>
        <h3>Used Cars in Dubai</h3>
        <h3>
          <span>Change</span>
        </h3>
      </div>

      <InfiniteScroll pageStart={0} loadMore={getData} hasMore={hasMore}>
        {data.map((card) => {
          return <Card key={card.appointmentId} card={card} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default DisplayCars;
