const orderCardStyles = (theme) => ({
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
  mainButton: {
    color: "white",
    backgroundColor: "#FFB600",
  },
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

export default orderCardStyles;
