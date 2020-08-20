const carouselStyles = (theme) => ({
  root: {
    "& > *:focus": {
      outline: "none",
    },
  },
  content: {
    width: "60%",
    maxWidth: 700,
    height: "calc(100% - 96px)",
    maxHeight: 600,
    margin: "-16px auto 0",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
  },
  contentMobile: {
    width: "100%",
    height: "100%",
    maxWidth: "initial",
    maxHeight: "initial",
    margin: 0,
    top: 0,
    transform: "none",

    "& > $carouselWrapper": {
      borderRadius: 0,
    },
  },
  arrow: {
    width: 48,
    height: 48,
    position: "absolute",
    top: "calc((100% - 96px) / 2 + 24px)",
  },
  arrowLeft: {
    left: -96,
  },
  arrowRight: {
    right: -96,
  },
  arrowIcon: {
    color: "grey",
  },
  carouselWrapper: {
    overflow: "hidden",
    borderRadius: 14,
    transform: "scale(1.0)",
    background: "transparent",
    height: "100%",
  },
  dots: {
    paddingTop: 36,
    margin: "0 auto",
  },
  dotsMobile: {
    paddingTop: 0,
  },
  dotsMobileLandscape: {
    paddingTop: 20,
  },
  footer: {
    marginTop: -72,
    width: "100%",
    position: "relative",
    textAlign: "center",
  },
  footerMobile: {
    marginTop: -92,
  },
  footerMobileLandscape: {
    marginTop: -3,
    transform: "translateY(-50vh)",
    display: "inline-block",
    width: "auto",
  },
  slide: {
    width: "100%",
    height: "100%",
  },
  slideMobile: {
    width: "100%",
    height: "100%",
  },
  carousel: {
    height: "100%",
  },
  carouselContainer: {
    height: "100%",
  },
  closed: {},
  mobileArrow: {
    [theme.breakpoints.down(500)]: {
      display: "none",
    },
  },
});

export default carouselStyles;
