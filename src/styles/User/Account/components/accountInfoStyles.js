const accountInfoStyles = (theme) => ({
  root: {
    maxWidth: 400,
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
    textAlign: "center",
  },
  cardFooter: {
    backgroundColor: "#01c9e1",
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
  },
});

export default accountInfoStyles;
