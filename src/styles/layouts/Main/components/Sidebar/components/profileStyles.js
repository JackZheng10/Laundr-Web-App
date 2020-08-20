const profileStyles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content",
  },
  avatar: {
    width: 60,
    height: 60,
    color: "white",
    backgroundColor: "#21d0e5",
  },
  name: {
    marginTop: theme.spacing(1),
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default profileStyles;
