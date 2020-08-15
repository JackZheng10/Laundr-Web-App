const reviewStyles = (theme) => ({
  total: {
    fontWeight: 700,
  },
  root: {
    minWidth: 275,
  },
  listRoot: {
    width: "100%",
    maxWidth: 360,
  },
  removePadding: {
    padding: 16,
    "&:last-child": {
      paddingBottom: 15,
    },
  },
  cardHeader: {
    backgroundColor: "#01c9e1",
  },
  cardFooter: {
    backgroundColor: "#01c9e1",
    justifyContent: "center",
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

export default reviewStyles;
