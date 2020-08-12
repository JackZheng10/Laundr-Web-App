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
import TooltipButton from "../../../Driver/OrderTable/components/TooltipButton";
import orderCellStyles from "../../../../styles/Driver/components/OrderTable/components/orderCellStyles";

const OrderCell = (props) => {
  const { classes, order, actionText, action, stage, prefs } = props;

  return (
    <TableRow>
      <TableCell>
        <div className={classes.nameContainer}>
          <Typography variant="body1">
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
            <Paper
              elevation={1}
              style={{
                padding: 5,
              }}
            >
              <Grid container justify="center">
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  Pickup:&nbsp;
                </Typography>
                <Typography variant="body1">{` ${order.pickupInfo.date} @ ${order.pickupInfo.time}`}</Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              elevation={1}
              style={{
                padding: 5,
              }}
            >
              <Grid container justify="center">
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  Dropoff:&nbsp;
                </Typography>
                <Typography variant="body1">
                  {` ${order.dropoffInfo.date} @ ${order.dropoffInfo.time}`}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>{order.userInfo.phone}</TableCell>
      <TableCell>
        <TooltipButton
          text={order.washerInfo.prefs}
          className={classes.secondaryButton}
          buttonText={"View"}
        />
      </TableCell>
      <TableCell>{prefs}</TableCell>
      <TableCell>placeholder</TableCell>
      <TableCell>{stage}</TableCell>
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
