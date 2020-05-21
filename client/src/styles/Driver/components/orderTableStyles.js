export default (theme) => ({
  root: {},
  noPaddingCard: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
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
      "linear-gradient( 136deg, rgb(102, 255, 255) 0%, rgb(0, 153, 255) 50%, rgb(0, 51, 204) 100%)",
    color: "white",
  },
  cardCell: {
    display: "flex",
    alignItems: "center",
    padding: 5,
  },
});
