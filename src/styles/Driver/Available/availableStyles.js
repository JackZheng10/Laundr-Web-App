const availableDashboardStyles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  welcomeCard: {
    background: "#01c9e1",
  },
  welcomeText: {
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  componentName: {
    color: "white",
    textAlign: "center",
    paddingBottom: 10,
  },
});

export default availableDashboardStyles;
