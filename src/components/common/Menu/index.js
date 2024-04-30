const { Popover, MenuItem, Menu, Box } = require("@mui/material");
import { bgBlur } from "@/utils/cssStyles";
import { styled } from "@mui/material/styles";

const CustomPopover = ({ open, anchorEl, onClose, children, padding, minWidth }) => {
	const StyledRoot = styled(Box)(({ theme }) => ({
		...bgBlur({ color: theme.palette.background.paper, opacity: 0.8, backgroundGradient: true }),
		boxShadow: "none",
		// paddingTop: "10px",
		padding: padding ? `${padding}px` : 0,
		minWidth: `${minWidth}px`,
	}));

	return (
		<Menu
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center",
			}}
			sx={{
				"& .MuiPaper-root": {
					backgroundColor: "transparent",
				},
				"& .MuiList-root": { padding: 0 },
			}}>
			<StyledRoot>{children}</StyledRoot>
		</Menu>
	);
};

export default CustomPopover;
