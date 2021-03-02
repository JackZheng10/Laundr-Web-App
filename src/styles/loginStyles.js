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
    // backgroundRepeat: "no-repeat",
    // backgroundPosition: "center",
    // backgroundImage: `url("/images/space.png")`,
    // backgroundSize: "cover",
    // [theme.breakpoints.up(770)]: {
    //   backgroundImage: `url("/images/space.png")`,
    // },
    // [theme.breakpoints.down(770)]: {
    //   backgroundImage: `url("/images/space_mobilev2.png")`,
    // },
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
  secondaryButton: {
    color: "white",
    backgroundColor: "#01c9e1",
  },
  mainButton: {
    color: "white",
    backgroundColor: "#FFB600",
  },
});

export default loginStyles;
