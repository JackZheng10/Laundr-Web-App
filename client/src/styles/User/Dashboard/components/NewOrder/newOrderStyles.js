const newOrderStyles = (theme) => ({
  appBar: {
    position: "relative",
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
  root: {
    width: "100%",
    position: "relative",
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    backgroundImage:
      "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    color: "white",
  },
  secondaryButton: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    color: "white",
    backgroundColor: "#01c9e1",
  },
  mainButton: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    color: "white",
    backgroundColor: "#FFB600",
  },
});

export default newOrderStyles;
