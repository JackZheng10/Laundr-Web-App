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
  redButton: {
    backgroundColor: "rgb(255, 51, 0)",
    color: "white",
  },
  greenButton: {
    backgroundColor: "rgb(0, 130, 0)",
    color: "white",
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
  coloredField: {
    backgroundColor: "white",
    borderRadius: 4,
    "& label.Mui-focused": {
      color: "#01c9e1",
    },

    "& .MuiFilledInput-underline:after": {
      borderBottom: "2px solid #01c9e1",
    },
    "& .MuiFilledInput-underline.Mui-error:after": {
      borderBottom: "2px solid #e53935",
    },

    "& .MuiFilledInput-root": {
      backgroundColor: "white",
      boxShadow:
        "0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)",
    },
  },
});

export default accountInfoStyles;
