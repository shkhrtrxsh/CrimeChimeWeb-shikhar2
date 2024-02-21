// ----------------------------------------------------------------------

export default function Table(theme) {
    return {
      // MuiCard: {
      //   styleOverrides: {
      //     root: {
      //       boxShadow: theme.shadows[2],
      //       borderRadius: Number(theme.shape.borderRadius) * 2,
      //       position: 'relative',
      //       zIndex: 0, // Fix Safari overflow: hidden with border radius
      //     },
      //   },
      // },
      MuiTableHead: {
        styleOverrides: {
              root: {
                backgroundColor: "#f7f7f7"
              },
          },
      },
    };
  }
  