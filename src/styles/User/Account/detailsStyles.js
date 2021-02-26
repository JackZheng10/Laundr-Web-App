const accountStyles = (theme) => ({
  welcomeText: {
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  componentName: {
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  infoCard: {
    width: 500,
    textAlign: "center",
  },
  cardHeader: {
    backgroundColor: "#01c9e1",
  },
  cardFooter: {
    backgroundColor: "#01c9e1",
    justifyContent: "center",
  },
  secondaryButton: {
    color: "white",
    backgroundColor: "#01c9e1",
  },
  mainButton: {
    color: "white",
    backgroundColor: "#FFB600",
  },
  input: {
    "& label.Mui-focused": {
      color: "#01c9e1",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#01c9e1",
      },
    },
    [theme.breakpoints.down(325)]: {
      width: "50vw",
    },
  },
  removePadding: {
    padding: 16,
    "&:last-child": {
      paddingBottom: 15,
    },
  },
  root: {
    maxWidth: 400,
  },
  codeInput: {
    "& label.Mui-focused": {
      color: "#01c9e1",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#01c9e1",
      },
    },
  },
});

export default accountStyles;
