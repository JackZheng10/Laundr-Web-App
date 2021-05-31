const preferenceCardStyles = (theme) => ({
  root: {
    width: 270,
    [theme.breakpoints.down(650)]: {
      width: "40vw",
    },
    [theme.breakpoints.down(560)]: {
      width: "35vw",
    },
    [theme.breakpoints.down(380)]: {
      width: "35vw",
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
});

export default preferenceCardStyles;
