const orderTableStyles = (theme) => ({
  root: {},
  inner: {},
  nameContainer: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: "flex-end",
  },
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
  noPaddingCard: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
});

export default orderTableStyles;
