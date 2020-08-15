import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
} from "@material-ui/core";
import PropTypes from "prop-types";
import OrderCell from "./components/OrderCell";
import orderTableStyles from "../../../../styles/Driver/components/OrderTable/orderTableStyles";

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled

//configure for user, driver, washer
//driver first

class OrderTable extends Component {
  renderOrderCells = (orders, config) => {
    return orders.map((order, index) => {
      return <OrderCell order={order} config={config} key={index} />;
    });
  };

  // renderOrderCards = (orders) => {
  //   return orders.map((order, index) => {
  //     return (
  //       <Grid item>
  //         <OrderCard
  //           order={order}
  //           actionText={this.renderActions(order.orderInfo.status)}
  //           action={() => {
  //             this.handleActionClicked(order.orderInfo.status, order);
  //           }}
  //           stage={this.renderStage(order.orderInfo.status)}
  //           key={index}
  //         />
  //       </Grid>
  //     );
  //   });
  // };

  renderTableHeader = (config, classes) => {
    switch (config) {
      case "none":
        return null;

      case "orderHistoryDriver":
        return (
          <React.Fragment>
            <TableCell align="left" className={classes.tableHeader}>
              Name
            </TableCell>
            <TableCell align="left" className={classes.tableHeader}>
              Date/Time
            </TableCell>
            <TableCell align="left" className={classes.tableHeader}>
              Address
            </TableCell>
            <TableCell align="left" className={classes.tableHeader}>
              Instructions
            </TableCell>
            <TableCell align="left" className={classes.tableHeader}>
              Load Size
            </TableCell>
            <TableCell align="left" className={classes.tableHeader}>
              Price
            </TableCell>
            <TableCell align="left" className={classes.tableHeader}>
              Stage
            </TableCell>
          </React.Fragment>
        );
    }
  };

  render() {
    const { classes, orders, config } = this.props;

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" className={classes.tableHeader}>
                ID
              </TableCell>
              {this.renderTableHeader(config, classes)}
              <TableCell align="left" className={classes.tableHeader}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.renderOrderCells(orders, config)}</TableBody>
        </Table>
      </TableContainer>
    );
  }
}

OrderTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(orderTableStyles)(OrderTable);
