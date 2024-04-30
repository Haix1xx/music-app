import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css'
// @mui
import { alpha, styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

export const StyledRootScrollbar = styled("div")(() => ({
    flexGrow: 1,
    overflow: "hidden",
    // height: 1,
}));

export const StyledScrollbar = styled(SimpleBar)(({ theme }) => ({
    height: 1,
    maxHeight: "100%",
    "& .simplebar-scrollbar": {
        "&:before": {
            backgroundColor: alpha(theme.palette.grey[600], 0.48),
        },
        "&.simplebar-visible:before": {
            opacity: 1,
        },
    },
    "& .simplebar-track.simplebar-vertical": {
        width: 10,
    },
    "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
        height: 6,
        "&:before": {
            backgroundColor: alpha(theme.palette.grey[600], 0),
        },
    },
    "& .simplebar-mask": {
        zIndex: "inherit",
    },
}));