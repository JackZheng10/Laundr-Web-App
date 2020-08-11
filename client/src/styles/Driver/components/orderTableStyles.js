const orderTableStyles = (theme) => ({
  noPaddingCard: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
  },
  gradient: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    color: "white",
  },
  cardCell: {
    display: "flex",
    alignItems: "center",
    padding: 5,
  },
  mainButton: {
    color: "white",
    backgroundColor: "#FFB600",
  },
  secondaryButton: {
    color: "white",
    backgroundColor: "#01c9e1",
  },
  /*card stuff*/
  root: {
    width: "100%",
    height: "100%",
  },
  layout: {
    marginLeft: "auto",
    marginRight: "auto",
    height: "auto",
    [theme.breakpoints.up(400)]: {
      width: 350,
    },
    [theme.breakpoints.down(400)]: {
      width: "90vw",
    },
  },
  cardHeader: {
    textAlign: "center",
    backgroundColor: "#01C9E1",
  },
  title: {
    color: "white",
  },
  cardActions: {
    backgroundColor: "#01C9E1",
  },
  inlineText: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
});

export default orderTableStyles;
