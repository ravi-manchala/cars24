import React from "react";
import classes from "./Card.module.css";

const Card = (props) => {
  return (
    <div className={classes.card}>
      <div>
        <img
          className={classes.carimage}
          src={`https://fastly-production.24c.in/${props.card.mainImage.path}`}
          alt={props.card.mainImage.label}
        />
      </div>
      <div className={classes.cardetails}>
        <div className={classes.specification}>
          <div className={classes.likebtn}>
            <h4>
              {props.card.year} {props.card.make} {props.card.model}
            </h4>
            <img
              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/e8333986534ba8a423ce86582be0003d.svg"
              alt="Add to wishlist"
            />
          </div>
          <p>
            <strong>{props.card.variant} </strong>
            <span>{props.card.specs} specification</span>
          </p>
          <div className={classes.speedmeter}>
            <img
              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/15bbe7d4f9e51f5043535857c52d7336.svg"
              alt="Kilometer Icon"
            ></img>
            <span> {props.card.odometerReading} km</span>

            <img
              className={classes.turbo}
              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/5570637da94bead30f0c65f9faca1c5e.svg"
              alt="Turbo Icon"
            ></img>
            <span>
              {props.card.noOfCylinders}cyl{props.card.engineSize}L
            </span>
          </div>
        </div>

        <div className={classes.emi}>
          <div className={classes.emimonthly}>
            <h4>AED {props.card.emiDetails.emi}/month</h4>
            <p>AED {props.card.downPayment} downpayment</p>
          </div>
          <div className={classes.price}>
            <h4>AED {props.card.price}</h4>
            <p>
              <del>AED {props.card.discountAmount}</del>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
