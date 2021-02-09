const pricingStyles = (theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  layout: {
    marginLeft: "auto",
    marginRight: "auto",
    height: "auto",
    [theme.breakpoints.up(400)]: {
      width: 200,
    },
    [theme.breakpoints.down(400)]: {
      width: "90vw",
    },
  },
  cardContent: {
    backgroundColor: "white",
  },
  title: {
    color: "white",
  },
  removePadding: {
    padding: 16,
    "&:last-child": {
      paddingBottom: 15,
    },
  },
  cardHeader: {
    backgroundColor: "#01c9e1",
  },
  subPriceAdText: {
    padding: theme.spacing(1),
    backgroundColor: "#FFB600",
  },
  subCard: {
    [theme.breakpoints.down(400)]: {
      width: "80vw",
    },
    width: "auto",
  },
});

export default pricingStyles;
