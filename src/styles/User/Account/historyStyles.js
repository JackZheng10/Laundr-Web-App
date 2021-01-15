const historyStyles = (theme) => ({
  componentName: {
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  tableHeader: {
    backgroundColor: "#01c9e1",
    color: "white",
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
  },
});

export default historyStyles;
