const orderCardStyles = (theme) => ({
  gradient: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    color: "white",
  },
  cardCell: {
    display: "flex",
    alignItems: "center",
    padding: 5,
  },
  mainButton: {
    color: "white",
    backgroundColor: "#FFB600",
  },
  secondaryButton: {
    color: "white",
    backgroundColor: "#01c9e1",
  },
  removePadding: {
    padding: 16,
    "&:last-child": {
      paddingBottom: 15,
    },
  },
  root: {
    minWidth: 275,
  },
});

export default orderCardStyles;
