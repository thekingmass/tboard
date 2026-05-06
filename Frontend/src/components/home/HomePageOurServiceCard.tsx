import React from "react";
import { Paper, Typography } from "@mui/material";

export type HomePageOurServiceCardProps = {
	title: string;
	description: string;
};

const HomePageOurServiceCard: React.FC<HomePageOurServiceCardProps> = ({
	title,
	description,
}) => {
	return (
		<Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)" }}>
			<Typography variant="h6" sx={{ color: "common.white", mb: 1 }}>{title}</Typography>
			<Typography variant="body1" sx={{ color: "rgba(255,255,255,0.78)" }}>{description}</Typography>
		</Paper>
	);
};

export default HomePageOurServiceCard;
