const subscriptionCardStyles = (theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  layout: {
    marginLeft: "auto",
    marginRight: "auto",
    height: "auto",
    width: 400,
    [theme.breakpoints.down(520)]: {
      width: "90vw",
    },
  },
  media: {
    height: 0,
    paddingTop: "66.25%",
  },
  gradientButton: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    color: "white",
  },
  cardHeader: {
    backgroundColor: "#01c9e1",
  },
  secondaryButton: {
    color: "white",
    backgroundColor: "#01c9e1",
  },
  mainButton: {
    color: "white",
    backgroundColor: "#FFB600",
  },
});

export default subscriptionCardStyles;
