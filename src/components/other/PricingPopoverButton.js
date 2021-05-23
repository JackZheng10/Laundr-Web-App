import React, { Component } from "react";
import {
  Typography,
  withStyles,
  Paper,
  Grid,
  TableCell,
  TableRow,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  List,
  ListItemText,
  ListItem,
  Divider,
} from "@material-ui/core";
import PopoverButton from "./PopoverButton";

const pricingStyles = (theme) => ({
  secondaryButton: {
    color: "white",
    backgroundColor: "#01c9e1",
  },
  priceCard: {
    minWidth: 275,
  },
  removePadding: {
    padding: 16,
    "&:last-child": {
      paddingBottom: 15,
    },
  },
});

const PricingPopoverButton = (props) => {
  const {
    order,
    currentUser,
    showPriceLabel,
    labelStyles,
    priceStyles,
    containerStyles,
    labelVariant,
    priceVariant,
    classes,
  } = props;

  const subtotal = order.pricingInfo.subtotal;
  const subLbsDiscount = order.pricingInfo.subLbsDiscount;
  const balanceDiscount = order.pricingInfo.balanceDiscount;
  const priceMultiplier =
    currentUser.subscription.status === "active" ? 1.2 : 1.5;

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={containerStyles}
    >
      <Grid item>
        <Grid container justify="center">
          {showPriceLabel && (
            <Typography
              variant={labelVariant || "body1"}
              style={labelStyles}
              gutterBottom
            >
              Price:&nbsp;
            </Typography>
          )}
          <Typography
            variant={priceVariant || "body1"}
            style={priceStyles}
            gutterBottom
          >
            {order.pricingInfo.total === "N/A"
              ? "TBD"
              : order.pricingInfo.total}
          </Typography>
        </Grid>
      </Grid>
      {order.pricingInfo.total != "-1" && (
        <Grid item style={{ marginTop: -10 }}>
          <PopoverButton
            className={classes.secondaryButton}
            icon={true}
            content={
              <Card className={classes.priceCard} elevation={5}>
                <CardContent
                  className={classes.removePadding}
                  style={{ marginTop: -15, marginBottom: -15 }}
                >
                  <List disablePadding>
                    <ListItem>
                      <ListItemText
                        primary={"Subtotal"}
                        secondary={`${order.orderInfo.weight} lbs`}
                        primaryTypographyProps={{ variant: "h6" }}
                      />
                      <Typography variant="body1">{subtotal}</Typography>
                    </ListItem>
                    {order.washerInfo.separate && (
                      <ListItem>
                        <ListItemText
                          primary={"Separate"}
                          secondary={"Preference"}
                          primaryTypographyProps={{ variant: "h6" }}
                        />
                        <Typography variant="body1">$5.00</Typography>
                      </ListItem>
                    )}
                    {order.washerInfo.comforter && (
                      <ListItem>
                        <ListItemText
                          primary={"Comforter"}
                          secondary={"Preference"}
                          primaryTypographyProps={{ variant: "h6" }}
                        />
                        <Typography variant="body1">$10.00</Typography>
                      </ListItem>
                    )}
                    {order.dropoffInfo.date === order.pickupInfo.date && (
                      <ListItem>
                        <ListItemText
                          primary={"Delivery"}
                          secondary={"Same-day"}
                          primaryTypographyProps={{ variant: "h6" }}
                        />
                        <Typography variant="body1">
                          {(
                            (order.orderInfo.weight * 25).toFixed(0) / 100
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </Typography>
                      </ListItem>
                    )}
                    {parseFloat(subLbsDiscount.slice(1)) > 0 && (
                      <ListItem>
                        <ListItemText
                          primary={"Subscription Lbs"}
                          secondary={`${(
                            subLbsDiscount.slice(1) / priceMultiplier
                          ).toFixed(2)} lbs`}
                          primaryTypographyProps={{ variant: "h6" }}
                        />
                        <Typography variant="body1">
                          -{subLbsDiscount}
                        </Typography>
                      </ListItem>
                    )}
                    {parseFloat(balanceDiscount.slice(1)) > 0 && (
                      <ListItem>
                        <ListItemText
                          primary={"Credit"}
                          primaryTypographyProps={{ variant: "h6" }}
                        />
                        <Typography variant="body1">
                          -{balanceDiscount}
                        </Typography>
                      </ListItem>
                    )}
                  </List>
                </CardContent>
                <Divider />
                <CardContent
                  className={classes.removePadding}
                  style={{ marginTop: -5, marginBottom: -5 }}
                >
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <Grid container justify="center">
                        <Typography variant="h4" style={{ fontWeight: 600 }}>
                          Total:&nbsp;
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{ textAlign: "center" }}
                        >
                          {order.pricingInfo.total}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            }
          />
        </Grid>
      )}
    </Grid>
  );
};

export default withStyles(pricingStyles)(PricingPopoverButton);
