const paymentInfoStyles = (theme) => ({
  root: {
    maxWidth: 400,
  },
  gradientButton: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    color: "white",
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
  centerTitle: {
    textAlign: "center",
  },
});

export default paymentInfoStyles;
