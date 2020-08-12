import React, { Component } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  withStyles,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import PropTypes from "prop-types";
import TooltipButton from "./TooltipButton";
import orderCellStyles from "../../../../styles/Driver/components/OrderTable/components/orderCellStyles";

const OrderCell = (props) => {
  const { classes, order, actionText, action, stage } = props;

  return (
    <TableRow key={order.orderInfo.orderID}>
      <TableCell>
        <div className={classes.nameContainer}>
          <Typography variant="body1" style={{ textAlign: "center" }}>
            {`${order.userInfo.fname} ${order.userInfo.lname}`}
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid item>
            <Paper elevation={1}>
              <div className={classes.cardCell}>
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  Pickup:&nbsp;
                </Typography>
                <Typography
                  variant="body1"
                  style={{ textAlign: "center" }}
                >{` ${order.pickupInfo.date} @ ${order.pickupInfo.time}`}</Typography>
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={1}>
              <div className={classes.cardCell}>
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  Dropoff:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {` ${order.dropoffInfo.date} @ ${order.dropoffInfo.time}`}
                </Typography>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid item>
            <Paper elevation={1}>
              <div className={classes.cardCell}>
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  User:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {order.orderInfo.address}
                </Typography>
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={1}>
              <div className={classes.cardCell}>
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  Washer:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {order.washerInfo.address}
                </Typography>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid item>
            <Paper elevation={1}>
              <div className={classes.cardCell}>
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  User:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {order.userInfo.phone}
                </Typography>
              </div>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={1}>
              <div className={classes.cardCell}>
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  Washer:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {order.washerInfo.phone}
                </Typography>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <TooltipButton
          text={order.pickupInfo.prefs}
          className={classes.secondaryButton}
          buttonText={"View"}
        />
      </TableCell>
      <TableCell>placeholder</TableCell>
      <TableCell>
        <Typography variant="body1" style={{ textAlign: "center" }}>
          {stage}
        </Typography>
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          className={classes.mainButton}
          onClick={action}
        >
          {actionText}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default withStyles(orderCellStyles)(OrderCell);
