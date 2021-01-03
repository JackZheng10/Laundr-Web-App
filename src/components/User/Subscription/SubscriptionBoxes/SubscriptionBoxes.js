import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import SubscriptionCard from "./components/SubscriptionCard";

const SubscriptionBoxes = (props) => {
  return (
    <React.Fragment>
      <Grid item>
        <SubscriptionCard
          planName="Standard"
          image="/images/Subscription/Standard_new.png"
          priceText="$15/week"
          text="48 lbs/month"
          currentUser={props.currentUser}
        />
      </Grid>
      <Grid item>
        <SubscriptionCard
          planName="Plus"
          image="/images/Subscription/Plus_new.png"
          priceText="$20/week"
          text="66 lbs/month"
          currentUser={props.currentUser}
        />
      </Grid>
      <Grid item>
        <SubscriptionCard
          planName="Family"
          image="/images/Subscription/Family_new.png"
          priceText="$25/week"
          text="84 lbs/month"
          currentUser={props.currentUser}
        />
      </Grid>
      <Grid item>
        <SubscriptionCard
          planName="Student"
          image="/images/Subscription/Student_new.png"
          priceText="$10/week"
          text="40 lbs/month"
          currentUser={props.currentUser}
        />
      </Grid>
    </React.Fragment>
  );
};

export default SubscriptionBoxes;
