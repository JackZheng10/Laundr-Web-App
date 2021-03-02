const registerStyles = (theme) => ({
  layout: {
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.up(520)]: {
      width: 400,
    },
    [theme.breakpoints.down(520)]: {
      width: "90vw",
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#FFB600",
    color: "white",
  },
  coloredField: {
    backgroundColor: "white",
    borderRadius: 4,
    "& label.Mui-focused": {
      color: "#01c9e1",
    },
    // "& .MuiInput-underline:after": {
    //   borderBottomColor: "green",
    // },
    "& .MuiOutlinedInput-root": {
      // "& fieldset": {
      //   borderColor: "red",
      // },
      // "&:hover fieldset": {
      //   borderColor: "#01c9e1",
      // },
      // "&.Mui-focused fieldset": {
      //   borderColor: "#01c9e1",
      // },
    },
    // "& .MuiFormLabel-root": {
    //   color: "#01c9e1",
    // },
    // "& .MuiFormLabel-filled": {
    //   color: "#01c9e1",
    // },
    "& .MuiFilledInput-underline:after": {
      borderBottom: "2px solid #01c9e1",
    },
    "& .MuiFilledInput-underline.Mui-error:after": {
      borderBottom: "2px solid #e53935",
    },
    // "& .MuiFilledInput-underline:before": {
    //   borderBottom: "1px solid #01c9e1",
    // },
    "& .MuiFilledInput-root": {
      backgroundColor: "white",
      boxShadow:
        "0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "white",
      borderRadius: 4,
    },
  },
  logo: {
    [theme.breakpoints.up(520)]: {
      width: 400,
    },
    [theme.breakpoints.down(520)]: {
      width: "90vw",
    },
  },
  pageContainer: {
    minHeight: "100vh",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: `url("/images/space.png")`,
    backgroundSize: "cover",
    [theme.breakpoints.up(770)]: {
      backgroundImage: `url("/images/space.png")`,
    },
    [theme.breakpoints.down(770)]: {
      backgroundImage: `url("/images/space_mobilev2.png")`,
    },
  },
  error: {
    color: "red",
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
  },
  referralInput: {
    [theme.breakpoints.down(350)]: {
      fontSize: 12,
    },
    [theme.breakpoints.down(300)]: {
      fontSize: 10,
    },
  },
});

export default registerStyles;
