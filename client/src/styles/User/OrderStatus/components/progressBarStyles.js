export default (theme) => ({
  root: {
    width: "100%",
    [theme.breakpoints.down(650)]: {
      display: "none",
    },
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  secondaryStepper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    [theme.breakpoints.up(649)]: {
      display: "none",
    },
  },
  secondaryStepText: {
    marginTop: 5,
  },
});
