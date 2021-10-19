import React, { useState, useEffect } from "react";
import Axios from "axios";
import classes from "./DisplayCars.module.css";

const DisplayCars = () => {
  const [data, setData] = useState([]);
  const getData = () => {
    Axios.get(
      "https://listing-service.qac24svc.dev/v1/vehicle?sf=city:DU_DUBAI&size=25&spath=buy-used-cars-dubai&variant=filterV3&page=1",
      { headers: { X_COUNTRY: "AE", X_VEHICLE_TYPE: "CAR" } }
    ).then((resp) => {
      setData(resp.data.results);
    });
  };

  useEffect(() => {
    getData();
  }, [data]);
  return (
    <div style={{ marginTop: "80px" }}>
      <h3>Used cars in Dubai</h3>

      {data.map((img) => {
        return (
          <div key={img.appointmentId} className={classes.card}>
            <img
              className={classes.image}
              // style={{ width: "300px", height: "300px" }}
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
            <span> {img.odometerReading}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayCars;
