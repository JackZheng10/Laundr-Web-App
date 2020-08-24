const loginStyles = (theme) => ({
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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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
      "&:hover fieldset": {
        borderColor: "#01c9e1",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#01c9e1",
      },
    },
  },
  logo: {
    [theme.breakpoints.up(520)]: {
      width: 450,
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
