const dashboardStyles = (theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "blue",
    },
  },
  fabProgress: {
    color: "#01c9e1",
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: "#01c9e1",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  normalButton: {
    backgroundColor: "#01c9e1",
    "&:hover": {
      backgroundColor: "#01c9e1",
    },
  },
});

export default dashboardStyles;
