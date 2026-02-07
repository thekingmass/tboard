import React from "react";
import "./styles/HomePageOurServiceCard.css";

export type HomePageOurServiceCardProps = {
	title: string;
	description: string;
};

const HomePageOurServiceCard: React.FC<HomePageOurServiceCardProps> = ({
	title,
	description,
}) => {
	return (
		<div className="serviceCard">
			<h3 className="serviceCardTitle">{title}</h3>
			<p className="serviceCardDescription">{description}</p>
		</div>
	);
};

export default HomePageOurServiceCard;
