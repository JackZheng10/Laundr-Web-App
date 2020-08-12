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
    textAlign: "center",
    backgroundColor: "#01C9E1",
  },
  title: {
    color: "white",
  },
});

export default pricingStyles;
