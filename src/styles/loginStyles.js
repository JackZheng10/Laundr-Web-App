const loginStyles = (theme) => ({
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
    // "& .MuiFilledInput-underline:before": {
    //   borderBottom: "1px solid #01c9e1",
    // },
    "& .MuiFilledInput-root": {
      backgroundColor: "white",
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
    height: "100vh",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    [theme.breakpoints.up(770)]: {
      backgroundImage: `url("/images/space.png")`,
      backgroundSize: "cover",
    },
    [theme.breakpoints.down(770)]: {
      backgroundImage: `url("/images/space_mobilev2.png")`,
      backgroundSize: "contain",
    },
  },
});

export default loginStyles;
