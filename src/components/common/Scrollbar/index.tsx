import PropTypes from "prop-types";
import { ReactNode, memo } from "react";
// @mui
import { Box } from "@mui/material";
//
import { StyledRootScrollbar, StyledScrollbar } from "./style";

// ----------------------------------------------------------------------

Scrollbar.propTypes = {
	sx: PropTypes.object,
	children: PropTypes.node,
};

function Scrollbar({ children, sx, ...other }: { children: ReactNode; sx: any }) {
	const userAgent = typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

	if (isMobile) {
		return (
			<Box sx={{ overflowX: "auto" }} {...other}>
				{children}
			</Box>
		);
	}

	return (
		<StyledRootScrollbar sx={sx}>
			<StyledScrollbar clickOnTrack={false} sx={{
				height: 1,
				"& .simplebar-content": {
					height: 1,
					display: "flex",
					flexDirection: "column",
				},
			}} {...other}>
				{children}
			</StyledScrollbar>
		</StyledRootScrollbar>
	);
}

export default memo(Scrollbar);
