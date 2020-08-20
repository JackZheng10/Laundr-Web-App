const dashboardStyles = (theme) => ({
  welcomeCard: {
    background: "#21d0e5",
  },
  welcomeText: {
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  orderComponentName: {
    color: "white",
    textAlign: "center",
  },
  root: {
    width: "100%",
    position: "relative",
  },
  layout: {
    [theme.breakpoints.down("sm")]: {
      width: "90vw",
      height: 600,
    },
    [theme.breakpoints.up(800)]: {
      width: "90vw",
      height: 600,
    },
    [theme.breakpoints.up(1034)]: {
      width: 1000,
      height: 600,
    },
    [theme.breakpoints.up(1482)]: {
      width: 1200,
      height: 600,
    },
    position: "relative",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  carouselTitle: {
    color: "white",
    textAlign: "center",
    paddingTop: 10,
  },
});

export default dashboardStyles;
