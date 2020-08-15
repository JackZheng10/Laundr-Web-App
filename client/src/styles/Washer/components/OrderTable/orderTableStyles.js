//unused, same as driver
const orderTableStyles = (theme) => ({
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

  noPaddingCard: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
});

export default orderTableStyles;
