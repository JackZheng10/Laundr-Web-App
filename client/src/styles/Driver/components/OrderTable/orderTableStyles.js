const orderTableStyles = (theme) => ({
  noPaddingCard: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  gradient: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    color: "white",
  },
  mainButton: {
    color: "white",
    backgroundColor: "#FFB600",
  },
  secondaryButton: {
    color: "white",
    backgroundColor: "#01c9e1",
  },
  tableHeader: {
    backgroundColor: "#01c9e1",
    color: "white",
  },
});

export default orderTableStyles;
