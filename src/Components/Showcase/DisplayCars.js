import React, { useState, useEffect } from "react";
import Axios from "axios";
import classes from "./DisplayCars.module.css";
import InfiniteScroll from "react-infinite-scroller";

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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ marginTop: "60px" }} className={classes.container}>
      <h3>Used cars in Dubai</h3>
      <InfiniteScroll pageStart={0} loadMore={getData} hasMore={true || false}>
        {data.map((img) => {
          return (
            <div key={img.appointmentId} className={classes.card}>
              <img
                className={classes.image}
                src={`https://fastly-production.24c.in/${img.mainImage.path}`}
                alt={img.mainImage.label}
              />
              <h4>
                {img.year} {img.make} {img.model}
              </h4>
              <p>
                <strong>
                  {img.variant} {img.engineSize}L{" "}
                </strong>
                {img.specs} specification
              </p>
              <img
                src="https://consumer-web-ae.qac24svc.dev/ae/static/js/15bbe7d4f9e51f5043535857c52d7336.svg"
                alt="Kilometer Icon"
              ></img>
              <span> {img.odometerReading} km</span>
            </div>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default DisplayCars;
