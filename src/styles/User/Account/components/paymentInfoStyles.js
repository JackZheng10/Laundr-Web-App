const paymentInfoStyles = (theme) => ({
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
  gradientButtonRed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(255, 51, 0) 15%, rgb(204, 0, 0) 50%, rgb(255, 51, 0) 100%)",
    color: "white",
  },
  gradientButtonGreen: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(0, 204, 0) 15%, rgb(0, 130, 0) 50%, rgb(0, 204, 0) 100%)",
    color: "white",
  },
});

export default paymentInfoStyles;
