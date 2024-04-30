// @mui
import { bgBlur } from "@/utils/cssStyles";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { Box, MenuItem, Stack, IconButton, Popover } from "@mui/material";

// hooks
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import useResponsive from "@/hooks/useResponsive";

// utils
import setLanguage from "next-translate/setLanguage";

// components
import Image from "next/image";

// -------------------------------------------------------------------

const LANGS = [
	{
		value: "vi",
		label: "Vietnamese",
		icon: "/icons/ic_flag_vi.svg",
	},
	{
		value: "en",
		label: "English",
		icon: "/icons/ic_flag_en.svg",
	},
];

const StyledRoot = styled(Box)(({ theme }) => ({
	...bgBlur({ color: theme.palette.background.paper, blur: 2, opacity: 0.925 }),
	boxShadow: "none",
	padding: "8px",
}));

// -------------------------------------------------------------------

export default function LanguagePopover() {
	const { t, lang } = useTranslation();
	const currentLang = LANGS.find((x) => x.value === lang);

	const isMobile = useResponsive("down", "sm");

	const [open, setOpen] = useState(null);

	const handleOpen = (event) => {
		setOpen(event.currentTarget);
	};

	const handleClose = () => {
		setOpen(null);
	};

	const handleClick = async (lang) => {
		setOpen(null);
		await setLanguage(lang);
	};

	return (
		<>
			<IconButton
				onClick={handleOpen}
				sx={{
					padding: 0,
					width: 48,
					height: 48,
					mr: isMobile ? 1 : 2,
					...(open && {
						backgroundColor: (theme) =>
							`${alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)} !important`,
						// 	boxShadow: (theme) => theme.customShadows.z8,
					}),
					// ...(isMobile && {
					// 	backgroundColor: `white !important`,
					// 	boxShadow: (theme) => theme.customShadows.z8,
					// }),
				}}>
				<Image src={currentLang.icon} alt={currentLang.label} width={28} height={20} />
			</IconButton>

			<Popover
				open={Boolean(open)}
				anchorEl={open}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				PaperProps={{
					sx: {
						p: 0,
						mt: 1.5,
						ml: 0.75,
						width: 180,
						backgroundColor: "transparent",
						"& .MuiMenuItem-root": {
							px: 1,
							typography: "body2",
							borderRadius: 0.75,
						},
					},
				}}>
				<StyledRoot>
					<Stack spacing={0.75}>
						{LANGS.map((option) => (
							<MenuItem key={option.value} selected={option.value === lang} onClick={() => handleClick(option.value)}>
								<Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />
								{t("common:" + option.label)}
							</MenuItem>
						))}
					</Stack>
				</StyledRoot>
			</Popover>
		</>
	);
}
