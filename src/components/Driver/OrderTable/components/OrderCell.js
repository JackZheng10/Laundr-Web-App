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
import TooltipButton from "../../../other/TooltipButton";
import orderCellStyles from "../../../../styles/Driver/components/OrderTable/components/orderCellStyles";

const OrderCell = (props) => {
  const { classes, order, actionText, action, stage, handleOnTheWayClick } = props;

  return (
    <TableRow>
      <TableCell>
        <Typography variant="body1">
          {`${order.userInfo.fname} ${order.userInfo.lname}`}
        </Typography>
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
                <Typography
                  variant="body1"
                  style={{ textAlign: "center" }}
                >{` ${order.pickupInfo.date} @ ${order.pickupInfo.time}`}</Typography>
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
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {` ${order.dropoffInfo.date} @ ${order.dropoffInfo.time}`}
                </Typography>
              </Grid>
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
            <Paper
              elevation={1}
              style={{
                padding: 5,
              }}
            >
              <Grid container justify="center">
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  User:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {order.orderInfo.address}
                </Typography>
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
                  Washer:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {order.washerInfo.address}
                </Typography>
              </Grid>
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
            <Paper
              elevation={1}
              style={{
                padding: 5,
              }}
            >
              <Grid container justify="center">
                <Typography variant="body1" style={{ fontWeight: 600 }}>
                  User:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {order.userInfo.phone}
                </Typography>
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
                  Washer:&nbsp;
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  {order.washerInfo.phone}
                </Typography>
              </Grid>
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
      <TableCell>{order.orderInfo.loads}</TableCell>
      <TableCell>{stage}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          className={classes.mainButton}
          onClick={action}
        >
          {actionText}
        </Button>
        { stage === "Weighing" && 
            <Button
             variant="contained"
             className={classes.mainButton}
             onClick={()=>handleOnTheWayClick(order, "pickup")}
           >
             On the way!
           </Button>
        }
        { stage === "Dropoff" && 
            <Button
             variant="contained"
             className={classes.mainButton}
             onClick={()=>handleOnTheWayClick(order, "dropoff")}
           >
             On the way!
           </Button>
        }
      </TableCell>
    </TableRow>
  );
};

export default withStyles(orderCellStyles)(OrderCell);
