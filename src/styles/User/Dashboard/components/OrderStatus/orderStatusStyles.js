const orderStatusStyles = (theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
  infoCard: {
    width: 300,
    textAlign: "center",
  },
  layout: {
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.up(649)]: {
      width: 600,
    },
    [theme.breakpoints.down(650)]: {
      width: "90vw",
    },
  },
  gradient: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    color: "white",
  },
  secondaryButton: {
    color: "white",
    backgroundColor: "#01c9e1",
  },
  mainButton: {
    color: "white",
    backgroundColor: "#FFB600",
  },
  cardHeader: {
    backgroundColor: "#01c9e1",
  },
  cardFooter: {
    backgroundColor: "#01c9e1",
    justifyContent: "center",
  },
  formControl: {
    minWidth: 197,
    paddingBottom: 10,
    paddingTop: 10,
  },
  title: {
    marginTop: theme.spacing(2),
  },
});

export default orderStatusStyles;
