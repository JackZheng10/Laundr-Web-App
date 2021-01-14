const loadingButtonStyles = (theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: "#01c9e1",
    position: "absolute",
    top: -42,
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
});

export default loadingButtonStyles;
